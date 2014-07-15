poll.js
================================
To install:

1. Clone repository.
2. Install [mongoDB](http://www.mongodb.org/downloads). Add mongodb/bin to the system path.
3. Install [node.js](http://nodejs.org/download/). Add node.js/ to the system path.
4. From the repository's directory, `npm install`.
5. Get a coffee while `npm` does all the hard work.
6. Start the app from the repository's directory with `npm start`.
7. Point a web browser at `localhost:3000` and enjoy!

Using Grunt
---------------------------------
This project is built with grunt. Most files have two versions, one called `foo_dev`, and one called `foo`. Make edits to `foo_dev` and then, from the project directory, type `grunt` to have the edits moved into `foo` and formatted for deployment. This will minify javascript, remove comments from JSON, check line endings, etc. In other words, good stuff! Note that on Windows, you may have to type `grunt.cmd`.

* `grunt` removes comments from package.json, checks line endings, and uglifies public javascript.
* `grunt cleaner` removes all log files and uglified public javascript. Note that this undoes the uglification of `grunt`.
* `grunt linter` lints all javascript files.

Known Issues
---------------------------------
* `server_stdout.log` contains color escape codes and other garbage.