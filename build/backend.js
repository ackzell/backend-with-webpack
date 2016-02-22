require("source-map-support").install();
/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var chunk = require("./" + "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(callback) { // eslint-disable-line no-unused-vars
/******/ 		try {
/******/ 			var update = require("./" + "" + hotCurrentHash + ".hot-update.json");
/******/ 		} catch(e) {
/******/ 			return callback();
/******/ 		}
/******/ 		callback(null, update);
/******/ 	}

/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "ca7ed1916c6134aed109"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					if(me.children.indexOf(request) < 0)
/******/ 						me.children.push(request);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				Object.defineProperty(fn, name, (function(name) {
/******/ 					return {
/******/ 						configurable: true,
/******/ 						enumerable: true,
/******/ 						get: function() {
/******/ 							return __webpack_require__[name];
/******/ 						},
/******/ 						set: function(value) {
/******/ 							__webpack_require__[name] = value;
/******/ 						}
/******/ 					};
/******/ 				}(name)));
/******/ 			}
/******/ 		}
/******/ 		Object.defineProperty(fn, "e", {
/******/ 			enumerable: true,
/******/ 			value: function(chunkId, callback) {
/******/ 				if(hotStatus === "ready")
/******/ 					hotSetStatus("prepare");
/******/ 				hotChunksLoading++;
/******/ 				__webpack_require__.e(chunkId, function() {
/******/ 					try {
/******/ 						callback.call(null, fn);
/******/ 					} finally {
/******/ 						finishChunkLoading();
/******/ 					}
/******/ 	
/******/ 					function finishChunkLoading() {
/******/ 						hotChunksLoading--;
/******/ 						if(hotStatus === "prepare") {
/******/ 							if(!hotWaitingFilesMap[chunkId]) {
/******/ 								hotEnsureUpdateChunk(chunkId);
/******/ 							}
/******/ 							if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 								hotUpdateDownloaded();
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				});
/******/ 			}
/******/ 		});
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback;
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback;
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "number")
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 				else
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailibleFilesMap = {};
/******/ 	var hotCallback;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply, callback) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		if(typeof apply === "function") {
/******/ 			hotApplyOnUpdate = false;
/******/ 			callback = apply;
/******/ 		} else {
/******/ 			hotApplyOnUpdate = apply;
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 		hotSetStatus("check");
/******/ 		hotDownloadManifest(function(err, update) {
/******/ 			if(err) return callback(err);
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				callback(null, null);
/******/ 				return;
/******/ 			}
/******/ 	
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotAvailibleFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			for(var i = 0; i < update.c.length; i++)
/******/ 				hotAvailibleFilesMap[update.c[i]] = true;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			hotCallback = callback;
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailibleFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailibleFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var callback = hotCallback;
/******/ 		hotCallback = null;
/******/ 		if(!callback) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate, callback);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			callback(null, outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options, callback) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		if(typeof options === "function") {
/******/ 			callback = options;
/******/ 			options = {};
/******/ 		} else if(options && typeof options === "object") {
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		} else {
/******/ 			options = {};
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function getAffectedStuff(module) {
/******/ 			var outdatedModules = [module];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice();
/******/ 			while(queue.length > 0) {
/******/ 				var moduleId = queue.pop();
/******/ 				var module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return new Error("Aborted because of self decline: " + moduleId);
/******/ 				}
/******/ 				if(moduleId === 0) {
/******/ 					return;
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return new Error("Aborted because of declined dependency: " + moduleId + " in " + parentId);
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push(parentId);
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return [outdatedModules, outdatedDependencies];
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				var moduleId = toModuleId(id);
/******/ 				var result = getAffectedStuff(moduleId);
/******/ 				if(!result) {
/******/ 					if(options.ignoreUnaccepted)
/******/ 						continue;
/******/ 					hotSetStatus("abort");
/******/ 					return callback(new Error("Aborted because " + moduleId + " is not accepted"));
/******/ 				}
/******/ 				if(result instanceof Error) {
/******/ 					hotSetStatus("abort");
/******/ 					return callback(result);
/******/ 				}
/******/ 				appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 				addAllToSet(outdatedModules, result[0]);
/******/ 				for(var moduleId in result[1]) {
/******/ 					if(Object.prototype.hasOwnProperty.call(result[1], moduleId)) {
/******/ 						if(!outdatedDependencies[moduleId])
/******/ 							outdatedDependencies[moduleId] = [];
/******/ 						addAllToSet(outdatedDependencies[moduleId], result[1][moduleId]);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(var i = 0; i < outdatedModules.length; i++) {
/******/ 			var moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			var moduleId = queue.pop();
/******/ 			var module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(var j = 0; j < disposeHandlers.length; j++) {
/******/ 				var cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(var j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				var idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				for(var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 					var dependency = moduleOutdatedDependencies[j];
/******/ 					var idx = module.children.indexOf(dependency);
/******/ 					if(idx >= 0) module.children.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(var moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(var i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					var dependency = moduleOutdatedDependencies[i];
/******/ 					var cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(var i = 0; i < callbacks.length; i++) {
/******/ 					var cb = callbacks[i];
/******/ 					try {
/******/ 						cb(outdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(var i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			var moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else if(!error)
/******/ 					error = err;
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return callback(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		callback(null, outdatedModules);
/******/ 	}

/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: hotCurrentParents,
/******/ 			children: []
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };

/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	module.exports = __webpack_require__(12);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	eval("/* WEBPACK VAR INJECTION */(function(__resourceQuery) {/*\r\n\tMIT License http://www.opensource.org/licenses/mit-license.php\r\n\tAuthor Tobias Koppers @sokra\r\n*/\r\n/*globals __resourceQuery */\r\nif(true) {\r\n\tfunction checkForUpdate(fromUpdate) {\r\n\t\tmodule.hot.check(function(err, updatedModules) {\r\n\t\t\tif(err) {\r\n\t\t\t\tif(module.hot.status() in {\r\n\t\t\t\t\t\tabort: 1,\r\n\t\t\t\t\t\tfail: 1\r\n\t\t\t\t\t}) {\r\n\t\t\t\t\tconsole.warn(\"[HMR] Cannot apply update.\");\r\n\t\t\t\t\tconsole.warn(\"[HMR] \" + err.stack || err.message);\r\n\t\t\t\t\tconsole.warn(\"[HMR] You need to restart the application!\");\r\n\t\t\t\t} else {\r\n\t\t\t\t\tconsole.warn(\"[HMR] Update failed: \" + err.stack || err.message);\r\n\t\t\t\t}\r\n\t\t\t\treturn;\r\n\t\t\t}\r\n\t\t\tif(!updatedModules) {\r\n\t\t\t\tif(fromUpdate)\r\n\t\t\t\t\tconsole.log(\"[HMR] Update applied.\");\r\n\t\t\t\telse\r\n\t\t\t\t\tconsole.warn(\"[HMR] Cannot find update.\");\r\n\t\t\t\treturn;\r\n\t\t\t}\r\n\r\n\t\t\tmodule.hot.apply({\r\n\t\t\t\tignoreUnaccepted: true\r\n\t\t\t}, function(err, renewedModules) {\r\n\t\t\t\tif(err) {\r\n\t\t\t\t\tif(module.hot.status() in {\r\n\t\t\t\t\t\t\tabort: 1,\r\n\t\t\t\t\t\t\tfail: 1\r\n\t\t\t\t\t\t}) {\r\n\t\t\t\t\t\tconsole.warn(\"[HMR] Cannot apply update (Need to do a full reload!)\");\r\n\t\t\t\t\t\tconsole.warn(\"[HMR] \" + err.stack || err.message);\r\n\t\t\t\t\t\tconsole.warn(\"[HMR] You need to restart the application!\");\r\n\t\t\t\t\t} else {\r\n\t\t\t\t\t\tconsole.warn(\"[HMR] Update failed: \" + err.stack || err.message);\r\n\t\t\t\t\t}\r\n\t\t\t\t\treturn;\r\n\t\t\t\t}\r\n\r\n\t\t\t\t__webpack_require__(2)(updatedModules, renewedModules);\r\n\r\n\t\t\t\tcheckForUpdate(true);\r\n\t\t\t});\r\n\t\t});\r\n\t}\r\n\r\n\tprocess.on(__resourceQuery.substr(1) || \"SIGUSR2\", function() {\r\n\t\tif(module.hot.status() !== \"idle\") {\r\n\t\t\tconsole.warn(\"[HMR] Got signal but currently in \" + module.hot.status() + \" state.\");\r\n\t\t\tconsole.warn(\"[HMR] Need to be in idle state to start hot update.\");\r\n\t\t\treturn;\r\n\t\t}\r\n\r\n\t\tcheckForUpdate();\r\n\t});\r\n} else {\r\n\tthrow new Error(\"[HMR] Hot Module Replacement is disabled.\");\r\n}\r\n\n/* WEBPACK VAR INJECTION */}.call(exports, \"\"))\n//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vKHdlYnBhY2spL2hvdC9zaWduYWwuanM/NzNkMiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxJQUFJO0FBQ0osR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEVBQUU7QUFDRixDQUFDO0FBQ0Q7QUFDQSIsImZpbGUiOiIxLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxyXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcclxuKi9cclxuLypnbG9iYWxzIF9fcmVzb3VyY2VRdWVyeSAqL1xyXG5pZihtb2R1bGUuaG90KSB7XHJcblx0ZnVuY3Rpb24gY2hlY2tGb3JVcGRhdGUoZnJvbVVwZGF0ZSkge1xyXG5cdFx0bW9kdWxlLmhvdC5jaGVjayhmdW5jdGlvbihlcnIsIHVwZGF0ZWRNb2R1bGVzKSB7XHJcblx0XHRcdGlmKGVycikge1xyXG5cdFx0XHRcdGlmKG1vZHVsZS5ob3Quc3RhdHVzKCkgaW4ge1xyXG5cdFx0XHRcdFx0XHRhYm9ydDogMSxcclxuXHRcdFx0XHRcdFx0ZmFpbDogMVxyXG5cdFx0XHRcdFx0fSkge1xyXG5cdFx0XHRcdFx0Y29uc29sZS53YXJuKFwiW0hNUl0gQ2Fubm90IGFwcGx5IHVwZGF0ZS5cIik7XHJcblx0XHRcdFx0XHRjb25zb2xlLndhcm4oXCJbSE1SXSBcIiArIGVyci5zdGFjayB8fCBlcnIubWVzc2FnZSk7XHJcblx0XHRcdFx0XHRjb25zb2xlLndhcm4oXCJbSE1SXSBZb3UgbmVlZCB0byByZXN0YXJ0IHRoZSBhcHBsaWNhdGlvbiFcIik7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUud2FybihcIltITVJdIFVwZGF0ZSBmYWlsZWQ6IFwiICsgZXJyLnN0YWNrIHx8IGVyci5tZXNzYWdlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKCF1cGRhdGVkTW9kdWxlcykge1xyXG5cdFx0XHRcdGlmKGZyb21VcGRhdGUpXHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIltITVJdIFVwZGF0ZSBhcHBsaWVkLlwiKTtcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRjb25zb2xlLndhcm4oXCJbSE1SXSBDYW5ub3QgZmluZCB1cGRhdGUuXCIpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bW9kdWxlLmhvdC5hcHBseSh7XHJcblx0XHRcdFx0aWdub3JlVW5hY2NlcHRlZDogdHJ1ZVxyXG5cdFx0XHR9LCBmdW5jdGlvbihlcnIsIHJlbmV3ZWRNb2R1bGVzKSB7XHJcblx0XHRcdFx0aWYoZXJyKSB7XHJcblx0XHRcdFx0XHRpZihtb2R1bGUuaG90LnN0YXR1cygpIGluIHtcclxuXHRcdFx0XHRcdFx0XHRhYm9ydDogMSxcclxuXHRcdFx0XHRcdFx0XHRmYWlsOiAxXHJcblx0XHRcdFx0XHRcdH0pIHtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS53YXJuKFwiW0hNUl0gQ2Fubm90IGFwcGx5IHVwZGF0ZSAoTmVlZCB0byBkbyBhIGZ1bGwgcmVsb2FkISlcIik7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUud2FybihcIltITVJdIFwiICsgZXJyLnN0YWNrIHx8IGVyci5tZXNzYWdlKTtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS53YXJuKFwiW0hNUl0gWW91IG5lZWQgdG8gcmVzdGFydCB0aGUgYXBwbGljYXRpb24hXCIpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS53YXJuKFwiW0hNUl0gVXBkYXRlIGZhaWxlZDogXCIgKyBlcnIuc3RhY2sgfHwgZXJyLm1lc3NhZ2UpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0cmVxdWlyZShcIi4vbG9nLWFwcGx5LXJlc3VsdFwiKSh1cGRhdGVkTW9kdWxlcywgcmVuZXdlZE1vZHVsZXMpO1xyXG5cclxuXHRcdFx0XHRjaGVja0ZvclVwZGF0ZSh0cnVlKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHByb2Nlc3Mub24oX19yZXNvdXJjZVF1ZXJ5LnN1YnN0cigxKSB8fCBcIlNJR1VTUjJcIiwgZnVuY3Rpb24oKSB7XHJcblx0XHRpZihtb2R1bGUuaG90LnN0YXR1cygpICE9PSBcImlkbGVcIikge1xyXG5cdFx0XHRjb25zb2xlLndhcm4oXCJbSE1SXSBHb3Qgc2lnbmFsIGJ1dCBjdXJyZW50bHkgaW4gXCIgKyBtb2R1bGUuaG90LnN0YXR1cygpICsgXCIgc3RhdGUuXCIpO1xyXG5cdFx0XHRjb25zb2xlLndhcm4oXCJbSE1SXSBOZWVkIHRvIGJlIGluIGlkbGUgc3RhdGUgdG8gc3RhcnQgaG90IHVwZGF0ZS5cIik7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRjaGVja0ZvclVwZGF0ZSgpO1xyXG5cdH0pO1xyXG59IGVsc2Uge1xyXG5cdHRocm93IG5ldyBFcnJvcihcIltITVJdIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnQgaXMgZGlzYWJsZWQuXCIpO1xyXG59XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogKHdlYnBhY2spL2hvdC9zaWduYWwuanNcbiAqKiBtb2R1bGUgaWQgPSAxXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9");

/***/ },
/* 2 */
/***/ function(module, exports) {

	eval("/*\r\n\tMIT License http://www.opensource.org/licenses/mit-license.php\r\n\tAuthor Tobias Koppers @sokra\r\n*/\r\nmodule.exports = function(updatedModules, renewedModules) {\r\n\tvar unacceptedModules = updatedModules.filter(function(moduleId) {\r\n\t\treturn renewedModules && renewedModules.indexOf(moduleId) < 0;\r\n\t});\r\n\r\n\tif(unacceptedModules.length > 0) {\r\n\t\tconsole.warn(\"[HMR] The following modules couldn't be hot updated: (They would need a full reload!)\");\r\n\t\tunacceptedModules.forEach(function(moduleId) {\r\n\t\t\tconsole.warn(\"[HMR]  - \" + moduleId);\r\n\t\t});\r\n\t}\r\n\r\n\tif(!renewedModules || renewedModules.length === 0) {\r\n\t\tconsole.log(\"[HMR] Nothing hot updated.\");\r\n\t} else {\r\n\t\tconsole.log(\"[HMR] Updated modules:\");\r\n\t\trenewedModules.forEach(function(moduleId) {\r\n\t\t\tconsole.log(\"[HMR]  - \" + moduleId);\r\n\t\t});\r\n\t}\r\n};\r\n\n//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vKHdlYnBhY2spL2hvdC9sb2ctYXBwbHktcmVzdWx0LmpzP2Q3NjIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EiLCJmaWxlIjoiMi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcclxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXHJcbiovXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odXBkYXRlZE1vZHVsZXMsIHJlbmV3ZWRNb2R1bGVzKSB7XHJcblx0dmFyIHVuYWNjZXB0ZWRNb2R1bGVzID0gdXBkYXRlZE1vZHVsZXMuZmlsdGVyKGZ1bmN0aW9uKG1vZHVsZUlkKSB7XHJcblx0XHRyZXR1cm4gcmVuZXdlZE1vZHVsZXMgJiYgcmVuZXdlZE1vZHVsZXMuaW5kZXhPZihtb2R1bGVJZCkgPCAwO1xyXG5cdH0pO1xyXG5cclxuXHRpZih1bmFjY2VwdGVkTW9kdWxlcy5sZW5ndGggPiAwKSB7XHJcblx0XHRjb25zb2xlLndhcm4oXCJbSE1SXSBUaGUgZm9sbG93aW5nIG1vZHVsZXMgY291bGRuJ3QgYmUgaG90IHVwZGF0ZWQ6IChUaGV5IHdvdWxkIG5lZWQgYSBmdWxsIHJlbG9hZCEpXCIpO1xyXG5cdFx0dW5hY2NlcHRlZE1vZHVsZXMuZm9yRWFjaChmdW5jdGlvbihtb2R1bGVJZCkge1xyXG5cdFx0XHRjb25zb2xlLndhcm4oXCJbSE1SXSAgLSBcIiArIG1vZHVsZUlkKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0aWYoIXJlbmV3ZWRNb2R1bGVzIHx8IHJlbmV3ZWRNb2R1bGVzLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0Y29uc29sZS5sb2coXCJbSE1SXSBOb3RoaW5nIGhvdCB1cGRhdGVkLlwiKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0Y29uc29sZS5sb2coXCJbSE1SXSBVcGRhdGVkIG1vZHVsZXM6XCIpO1xyXG5cdFx0cmVuZXdlZE1vZHVsZXMuZm9yRWFjaChmdW5jdGlvbihtb2R1bGVJZCkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIltITVJdICAtIFwiICsgbW9kdWxlSWQpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG59O1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqICh3ZWJwYWNrKS9ob3QvbG9nLWFwcGx5LXJlc3VsdC5qc1xuICoqIG1vZHVsZSBpZCA9IDJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=");

/***/ },
/* 3 */,
/* 4 */
/***/ function(module, exports) {

	eval("module.exports = require(\"express\");\n//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJleHByZXNzXCI/ZDJkMiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiI0LmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIFwiZXhwcmVzc1wiXG4gKiogbW9kdWxlIGlkID0gNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==");

/***/ },
/* 5 */
/***/ function(module, exports) {

	eval("module.exports = require(\"morgan\");\n//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJtb3JnYW5cIj8xOWVmIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6IjUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJtb3JnYW5cIik7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcIm1vcmdhblwiXG4gKiogbW9kdWxlIGlkID0gNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==");

/***/ },
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	eval("var express = __webpack_require__(4),\n    server  = express(),\n    morgan  = __webpack_require__(5),\n\n    conf    = __webpack_require__(13),\n    port    = conf.dev.port,\n    host    = conf.dev.host\n;\n\nserver.use(morgan('combined', {\n    skip: function (req, res) {\n\n    \treturn res.statusCode < 400;\n    }\n}));\n\nserver.use( express.static( \"./src/public\" ));\nserver.use( '/browser_scripts', express.static( './node_modules/angular2/bundles/') );\n\nserver.listen( port , host , function (){\n\n    console.log(\"Server running on \" + host + \" : \" + port + \", yay!\");\n\n} );\n\nfunction __eval() {\n  console.log('alo alo ');\n}\n\n\n/* HOT PATCH LOADER */ var __moduleBindings = [\"__eval\"]; if(true) {\n  module.hot.accept(function(err) {\n    console.log('[HMR] Error accepting: ' + err);\n  });\n\n  var getEvalSource = function(func) {\n    var code = func.toString();\n    var m = code.match(/^function\\s+__eval\\s*\\((.*)\\)\\s*\\{([\\s\\S]*)\\}$/i);\n    if(!m) {\n      return null;\n    }\n    var args = m[1];\n    var body = m[2];\n    var scope = {};\n\n    if(args.trim()) {\n      args.split(',').forEach(function(arg) {\n        if(arg.indexOf('=') !== -1) {\n          var p = arg.split('=');\n          scope[p[0].trim()] = JSON.parse(p[1]);\n        }\n        else {\n          scope[arg.trim()] = undefined;\n        }\n      });\n    }\n\n    return { body: body, scope: scope };\n  }\n\n  var injectScope = function(scope, code) {\n    // Take an explicit scope object and inject it so that\n    // `code` runs in context of it\n    var injected = Object.keys(scope).map(function(binding) {\n      return 'var ' + binding + ' = evalScope.' + binding + ';'\n    }).join(' ');\n\n    // Update our scope object with any modifications\n    var extracted = Object.keys(scope).map(function(binding) {\n      return 'evalScope.' + binding + ' = ' + binding + ';';\n    }).join(' ');\n\n    return injected + code + extracted;\n  }\n\n  var bindings = __moduleBindings;\n\n  if(!module.hot.data) {\n    // First time loading. Try and patch something.\n    var patchedBindings = {};\n    var evalScope = {};\n\n    var moduleEvalWithScope = function(frame) {\n      // Update the scope to reflect only the values specified as\n      // arguments to the __eval function. Copy over values from the\n      // existing scope and ignore the rest.\n      Object.keys(evalScope).forEach(function(arg) {\n        if(arg in frame.scope) {\n          frame.scope[arg] = evalScope[arg];\n        }\n      });\n      evalScope = frame.scope;\n\n      var code = injectScope(evalScope, frame.body);\n      return eval(code);\n    }\n\n    var moduleEval = function(code) {\n      return eval(code);\n    }\n\n    bindings.forEach(function(binding) {\n      var f = eval(binding);\n\n      if(typeof f === 'function' && binding !== '__eval') {\n        var patched = function() {\n          if(patchedBindings[binding]) {\n            return patchedBindings[binding].apply(this, arguments);\n          }\n          else {\n            return f.apply(this, arguments);\n          }\n        };\n        patched.prototype = f.prototype;\n\n        eval(binding + ' = patched;\\n');\n\n        if(module.exports[binding]) {\n          module.exports[binding] = patched;\n        }\n      }\n    });\n\n    module.hot.dispose(function(data) {\n      data.patchedBindings = patchedBindings;\n      data.moduleEval = moduleEval;\n      data.moduleEvalWithScope = moduleEvalWithScope;\n    });\n  }\n  else {\n    var patchedBindings = module.hot.data.patchedBindings;\n\n    bindings.forEach(function(binding) {\n      var f = eval(binding);\n\n      if(typeof f === 'function' && binding !== '__eval') {\n        // We need to reify the function in the original module so\n        // it references any of the original state. Strip the name\n        // and simply eval it.\n        var funcCode = (\n          '(' + f.toString().replace(/^function \\w+\\(/, 'function (') + ')'\n        );\n        patchedBindings[binding] = module.hot.data.moduleEval(funcCode);\n      }\n    });\n\n    if(typeof __eval === 'function') {\n      try {\n        module.hot.data.moduleEvalWithScope(getEvalSource(__eval));\n      }\n      catch(e) {\n        console.log('error evaling: ' + e);\n      }\n    }\n\n    module.hot.dispose(function(data) {\n      data.patchedBindings = patchedBindings;\n      data.moduleEval = module.hot.data.moduleEval;\n      data.moduleEvalWithScope = module.hot.data.moduleEvalWithScope;\n    });\n  }\n}\n\n//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hcHAuanM/ZDhlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiIxMi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBleHByZXNzID0gcmVxdWlyZSgnZXhwcmVzcycpLFxuICAgIHNlcnZlciAgPSBleHByZXNzKCksXG4gICAgbW9yZ2FuICA9IHJlcXVpcmUoJ21vcmdhbicpLFxuXG4gICAgY29uZiAgICA9IHJlcXVpcmUoJy4vc3JjL3NlcnZlci9jb25mLmpzJyksXG4gICAgcG9ydCAgICA9IGNvbmYuZGV2LnBvcnQsXG4gICAgaG9zdCAgICA9IGNvbmYuZGV2Lmhvc3Rcbjtcblxuc2VydmVyLnVzZShtb3JnYW4oJ2NvbWJpbmVkJywge1xuICAgIHNraXA6IGZ1bmN0aW9uIChyZXEsIHJlcykge1xuXG4gICAgXHRyZXR1cm4gcmVzLnN0YXR1c0NvZGUgPCA0MDA7XG4gICAgfVxufSkpO1xuXG5zZXJ2ZXIudXNlKCBleHByZXNzLnN0YXRpYyggXCIuL3NyYy9wdWJsaWNcIiApKTtcbnNlcnZlci51c2UoICcvYnJvd3Nlcl9zY3JpcHRzJywgZXhwcmVzcy5zdGF0aWMoICcuL25vZGVfbW9kdWxlcy9hbmd1bGFyMi9idW5kbGVzLycpICk7XG5cbnNlcnZlci5saXN0ZW4oIHBvcnQgLCBob3N0ICwgZnVuY3Rpb24gKCl7XG5cbiAgICBjb25zb2xlLmxvZyhcIlNlcnZlciBydW5uaW5nIG9uIFwiICsgaG9zdCArIFwiIDogXCIgKyBwb3J0ICsgXCIsIHlheSFcIik7XG5cbn0gKTtcblxuZnVuY3Rpb24gX19ldmFsKCkge1xuICBjb25zb2xlLmxvZygnYWxvIGFsbyAnKTtcbn1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vYXBwLmpzXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==");

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	eval("module.exports = {\n    dev : {\n        port : 3001,\n        host : \"0.0.0.0\"\n    }\n}\n\n/* HOT PATCH LOADER */ var __moduleBindings = []; if(true) {\n  module.hot.accept(function(err) {\n    console.log('[HMR] Error accepting: ' + err);\n  });\n\n  var getEvalSource = function(func) {\n    var code = func.toString();\n    var m = code.match(/^function\\s+__eval\\s*\\((.*)\\)\\s*\\{([\\s\\S]*)\\}$/i);\n    if(!m) {\n      return null;\n    }\n    var args = m[1];\n    var body = m[2];\n    var scope = {};\n\n    if(args.trim()) {\n      args.split(',').forEach(function(arg) {\n        if(arg.indexOf('=') !== -1) {\n          var p = arg.split('=');\n          scope[p[0].trim()] = JSON.parse(p[1]);\n        }\n        else {\n          scope[arg.trim()] = undefined;\n        }\n      });\n    }\n\n    return { body: body, scope: scope };\n  }\n\n  var injectScope = function(scope, code) {\n    // Take an explicit scope object and inject it so that\n    // `code` runs in context of it\n    var injected = Object.keys(scope).map(function(binding) {\n      return 'var ' + binding + ' = evalScope.' + binding + ';'\n    }).join(' ');\n\n    // Update our scope object with any modifications\n    var extracted = Object.keys(scope).map(function(binding) {\n      return 'evalScope.' + binding + ' = ' + binding + ';';\n    }).join(' ');\n\n    return injected + code + extracted;\n  }\n\n  var bindings = __moduleBindings;\n\n  if(!module.hot.data) {\n    // First time loading. Try and patch something.\n    var patchedBindings = {};\n    var evalScope = {};\n\n    var moduleEvalWithScope = function(frame) {\n      // Update the scope to reflect only the values specified as\n      // arguments to the __eval function. Copy over values from the\n      // existing scope and ignore the rest.\n      Object.keys(evalScope).forEach(function(arg) {\n        if(arg in frame.scope) {\n          frame.scope[arg] = evalScope[arg];\n        }\n      });\n      evalScope = frame.scope;\n\n      var code = injectScope(evalScope, frame.body);\n      return eval(code);\n    }\n\n    var moduleEval = function(code) {\n      return eval(code);\n    }\n\n    bindings.forEach(function(binding) {\n      var f = eval(binding);\n\n      if(typeof f === 'function' && binding !== '__eval') {\n        var patched = function() {\n          if(patchedBindings[binding]) {\n            return patchedBindings[binding].apply(this, arguments);\n          }\n          else {\n            return f.apply(this, arguments);\n          }\n        };\n        patched.prototype = f.prototype;\n\n        eval(binding + ' = patched;\\n');\n\n        if(module.exports[binding]) {\n          module.exports[binding] = patched;\n        }\n      }\n    });\n\n    module.hot.dispose(function(data) {\n      data.patchedBindings = patchedBindings;\n      data.moduleEval = moduleEval;\n      data.moduleEvalWithScope = moduleEvalWithScope;\n    });\n  }\n  else {\n    var patchedBindings = module.hot.data.patchedBindings;\n\n    bindings.forEach(function(binding) {\n      var f = eval(binding);\n\n      if(typeof f === 'function' && binding !== '__eval') {\n        // We need to reify the function in the original module so\n        // it references any of the original state. Strip the name\n        // and simply eval it.\n        var funcCode = (\n          '(' + f.toString().replace(/^function \\w+\\(/, 'function (') + ')'\n        );\n        patchedBindings[binding] = module.hot.data.moduleEval(funcCode);\n      }\n    });\n\n    if(typeof __eval === 'function') {\n      try {\n        module.hot.data.moduleEvalWithScope(getEvalSource(__eval));\n      }\n      catch(e) {\n        console.log('error evaling: ' + e);\n      }\n    }\n\n    module.hot.dispose(function(data) {\n      data.patchedBindings = patchedBindings;\n      data.moduleEval = module.hot.data.moduleEval;\n      data.moduleEvalWithScope = module.hot.data.moduleEvalWithScope;\n    });\n  }\n}\n\n//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvc2VydmVyL2NvbmYuanM/ZTlkYyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQyIsImZpbGUiOiIxMy5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGRldiA6IHtcbiAgICAgICAgcG9ydCA6IDMwMDEsXG4gICAgICAgIGhvc3QgOiBcIjAuMC4wLjBcIlxuICAgIH1cbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9zZXJ2ZXIvY29uZi5qc1xuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=");

/***/ }
/******/ ]);