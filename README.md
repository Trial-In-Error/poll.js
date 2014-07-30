poll.js
================================
To install:

1. Clone repository.
2. Install [mongoDB](http://www.mongodb.org/downloads). Add mongodb/bin to the system path.
3. Install [node.js](http://nodejs.org/download/). Add node.js/ to the system path.
4. From the repository's directory, `npm install`.
5. Get a coffee while `npm` does all the hard work.
6. Start the app from the repository's directory with `npm start`.
7. Point a web browser at `localhost:3000/polls` and enjoy!

Note that `npm run godbless` will start the server but not the database. This is useful for debugging changes without having to deal with `mongodb` and `forever`.

Adding a Poll
---------------------------------
1. Write a poll as a valid `.json` file, corresponding to the data model in `datamodel.md`.
2. From the terminal, `mongoimport --db polljs --collection polldb --jsonArray < pollname.json`.

Using Grunt
---------------------------------
This project is built with grunt. Most files have two versions, one called `foo_dev`, and one called `foo`. Make edits to `foo_dev` and then, from the project directory, type `grunt` to have the edits moved into `foo` and formatted for deployment. This will minify javascript, remove comments from JSON, check line endings, etc. In other words, good stuff! Note that on Windows, you may have to type `grunt.cmd`. Additionally, if using `grunt watch`, the work done by `grunt` is done automatically.

* `grunt` or `grunt dist` does it all. Cleans log files, removes comments from package.json, checks line endings, lints source, and uglifies public javascript.
* `grunt cleaner` removes all log files and uglified public javascript. Note that this undoes the uglification of `grunt`.
* `grunt linter` lints all javascript files.
* `grunt ender` fixes all files' line endings to unix standard.
* `grunt watch` automatically lints, uglifies, etc., as files are edited.
    * Note that `grunt watch` is currently not supported, and is likely to break things! Don't use it!


The Future
---------------------------------
* http://www.w3schools.com/html/html5_geolocation.asp
* http://stackoverflow.com/questions/15051712/how-to-do-authentication-with-a-rest-api-right-browser-native-clients
* http://stackoverflow.com/questions/176264/whats-the-difference-between-a-uri-and-a-url/1984225#1984225
* http://stackoverflow.com/questions/630453/put-vs-post-in-rest/630475#630475
* http://stackoverflow.com/questions/107390/whats-the-difference-between-a-post-and-a-put-http-request
* http://stackoverflow.com/questions/1058880/can-iphone-web-apps-get-gps-position
* http://ionicframework.com/getting-started/

Known Issues
---------------------------------
* `server_stdout.log` contains color escape codes and other garbage.
* Skype defaults to listening on port 443, blocking server.js from starting the HTTP server.
	* Right now, this crashes fatally for both servers.
* MongoDB under Mac OSX will not get as many file descriptors as it would like.
	* See: http://docs.mongodb.org/manual/reference/ulimit/