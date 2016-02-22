
Forked from [link](https://github.com/jlongster/backend-with-webpack/).

I added Angular2 into the mix, based on the work done in [Angular Class' webpack starter](https://github.com/AngularClass/angular2-webpack-starter).

#Known issues:
* Right now (Feb 22nd 2016) The server needs to be changed twice or an error about address in use will appear on the console. (See [this issue](https://github.com/jlongster/backend-with-webpack/issues/6)
* Also, the client side is presenting an issue where only modifying the file under src/public/app/app.ts will reflect changes on the browser (not refreshing, but actually patching the view with the new code), eventhough HMR acknowledges the changes on other files.

###Original Readme:
This is a very simple project to demo building backend apps with
webpack. To use:

1. `npm install`
2. `gulp run`

The latest version implements everything in [Backend Apps with Webpack: Part III](http://jlongster.com/Backend-Apps-with-Webpack--Part-III), allowing hot-patching of functions. This is also available on the frontend, so we've somewhat outgrown the name of this repo.

This is meant to along with my posts. Each post corresponds to a branch:

* [Backend Apps with Webpack: Part I](http://jlongster.com/Backend-Apps-with-Webpack--Part-I) - part1
* [Backend Apps with Webpack: Part II](http://jlongster.com/Backend-Apps-with-Webpack--Part-II) - part2a and part2b
* [Live Editing with Webpack: Part III](http://jlongster.com/Backend-Apps-with-Webpack--Part-III) - part3 (or master)
