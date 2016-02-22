var gulp = require('gulp');
var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var DeepMerge = require('deep-merge');
var nodemon = require('nodemon');
var WebpackDevServer = require('webpack-dev-server');

var deepmerge = DeepMerge(function(target, source, key) {
  if(target instanceof Array) {
    return [].concat(target, source);
  }
  return source;
});

// generic

var defaultConfig = {
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loaders: ['monkey-hot'] }
    ]
  }
};

if(process.env.NODE_ENV !== 'production') {
  defaultConfig.devtool = '#eval-source-map';
  //defaultConfig.devtool = 'source-map';
  defaultConfig.debug = true;
}

function config(overrides) {
  return deepmerge(defaultConfig, overrides || {});
}

// frontend

var frontendConfig = config({
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    path.join(__dirname, 'node_modules/angular2/bundles/angular2-polyfills.js'),
    path.join(__dirname, 'src/public/app/app.ts')
  ],
  output: {
    path: path.join(__dirname, 'src/public/build'),
    publicPath: 'http://localhost:3000/build',
    filename: 'frontend.js'
  },
  module: {
    resolve: {
      // ensure loader extensions match
      extensions: prepend(['.ts','.js','.json','.css','.html'], '.async') // ensure .async.ts etc also works
    },
    noParse: [ /zone\.js\/build\/.+/, /angular2\/bundles\/.+/ ],
    loaders: [
      { test: /\.ts$/, exclude: /node_modules/, loaders: ['monkey-hot', 'ts-loader'] },

      // Support for *.json files.
      { test: /\.json$/,  loaders: ['monkey-hot', 'json-loader'] },

      // Support for CSS as raw text
      { test: /\.css$/,   loaders: ['monkey-hot', 'raw-loader'] },

      // support for .html as raw text
      { test: /\.html$/,  loaders: ['monkey-hot', 'raw-loader'], exclude: [ './src/public/build/index.html' ] }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin({ quiet: true })
  ]
});

// backend

var nodeModules = fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  });

var backendConfig = config({
  entry: [
    'webpack/hot/signal.js',
    './app.js'
  ],
  target: 'node',
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'backend.js'
  },
  node: {
    __dirname: true,
    __filename: true
  },
  externals: [
    function(context, request, callback) {
      var pathStart = request.split('/')[0];
      if (nodeModules.indexOf(pathStart) >= 0 && request != 'webpack/hot/signal.js') {
        return callback(null, "commonjs " + request);
      };
      callback();
    }
  ],
  recordsPath: path.join(__dirname, 'build/_records'),
  plugins: [
    new webpack.IgnorePlugin(/\.(css|less)$/),
    new webpack.BannerPlugin('require("source-map-support").install();',
                             { raw: true, entryOnly: false }),
    new webpack.HotModuleReplacementPlugin({ quiet: true })
  ]
});

// tasks

function onBuild(done) {
  return function(err, stats) {
    if(err) {
      console.log('Error', err);
    }
    else {
      console.log(stats.toString());
    }

    if(done) {
      done();
    }
  }
}

gulp.task('frontend-build', function(done) {
  webpack(frontendConfig).run(onBuild(done));
});

gulp.task('frontend-watch', function() {
  //webpack(frontendConfig).watch(100, onBuild());

  new WebpackDevServer(webpack(frontendConfig), {
    publicPath: frontendConfig.output.publicPath,
    hot: true
  }).listen(3000, 'localhost', function (err, result) {
    if(err) {
      console.log(err);
    }
    else {
      console.log('webpack dev server listening at localhost:3000');
    }
  });

});

gulp.task('backend-build', function(done) {
  webpack(backendConfig).run(onBuild(done));
});

gulp.task('backend-watch', function(done) {
  var firedDone = false;
  webpack(backendConfig).watch(100, function(err, stats) {
    if(!firedDone) {
      firedDone = true;
      done();
    }

    nodemon.restart();
  });
});

gulp.task('build', ['frontend-build', 'backend-build']);
gulp.task('watch', ['frontend-watch', 'backend-watch']);

gulp.task('run', ['backend-watch', 'frontend-watch'], function() {
  nodemon({
    execMap: {
      js: 'node'
    },
    script: path.join(__dirname, 'build/backend'),
    ignore: ['*'],
    watch: ['foo/'],
    ext: 'noop'
  }).on('restart', function() {
    console.log('Patched!');
  });
});


function prepend(extensions, args) {
  args = args || [];
  if (!Array.isArray(args)) { args = [args] }
  return extensions.reduce(function(memo, val) {
    return memo.concat(val, args.map(function(prefix) {
      return prefix + val
    }));
  }, ['']);
}