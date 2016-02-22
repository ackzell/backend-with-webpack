var express = require('express'),
    server  = express(),
    morgan  = require('morgan'),

    conf    = require('./src/server/conf.js'),
    port    = conf.dev.port,
    host    = conf.dev.host
;

server.use(morgan('combined', {
    skip: function (req, res) {

    	return res.statusCode < 400;
    }
}));

server.use( express.static( "./src/public" ));
server.use( '/browser_scripts', express.static( './node_modules/angular2/bundles/') );

server.listen( port , host , function (){

    console.log("Server running on " + host + " : " + port + ", yay!");

} );

function __eval() {
  console.log('alo alo ');
}
