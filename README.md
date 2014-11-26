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

Note that `npm run godbless` will start the server but not the database. This is useful for debugging changes without having to deal with `mongodb` and `forever`.

Adding a Poll
---------------------------------
1. Write a poll as a valid `.json` file, corresponding to the data model in `datamodel.md`.
2. From the terminal, `mongoimport --db polljs --collection polldb --jsonArray < example_poll.json`.

Note that 2 example polls are included at poll.js's root directory.

Adding an Admin User
---------------------------------
1. Start the server with `npm run`. This will start a mongo database.
2. Create a normal user via the web interface at /login.
3. Access the database's shell from the `poll.js` directory with the command-line instruction `mongo`.
4. Chooese the mongo database for this project with `use polljs`.
5. Promote the user to an admin by `db.userdb.update({"type.login.username":<username>}, {$set: {"rights.<desiredRight>":true}})`. Note that you will have to do this for each right you wish to give to the admin.

Note that, because of the way session based authentication is done, the user will have to log back in after being promoted in order to have access to their new rights.

Using Grunt
---------------------------------
This project is built with grunt. Most files have two versions, one called `foo_dev`, and one called `foo`. Make edits to `foo_dev` and then, from the project directory, type `grunt` to have the edits moved into `foo` and formatted for deployment. This will minify javascript, remove comments from JSON, check line endings, etc. In other words, good stuff! Note that on Windows, you may have to type `grunt.cmd`. Additionally, if using `grunt watch`, the work done by `grunt` is done automatically.

* `grunt` or `grunt dist` does it all. Cleans log files, removes comments from package.json, checks line endings, lints source, and uglifies public javascript.
* `grunt cleaner` removes all log files and uglified public javascript. Note that this undoes the uglification of `grunt`.
* `grunt linter` lints all javascript files.
* `grunt ender` fixes all files' line endings to unix standard.
* `grunt watch` automatically lints, uglifies, etc., as files are edited.
    * Note that `grunt watch` is currently not supported, and is likely to break things! Don't use it unless you've fixed it!

Deploying to Heroku
---------------------------------
1. [Sign up for heroku.]( https://signup.heroku.com/signup/dc)
2. [Download and install the heroku toolbelt.](https://toolbelt.heroku.com/)
3. Authenticate with heroku using `heroku login`.
4. Commit changes via git with `git commit -m "trying heroku deployment!"`.
5. Create a heroku project with `heroku create`.
6. Deploy code with `git push heroku master`.
7. Start one dyno (worker process) with `heroku ps:scale web=1`.
8. REALLY MESSY MONGODB SETUP OH SHIT DOCUMENT THIS CRAP
9. EVEN MESSIER SSL / HTTPS SETUP FIGURE THIS OUTTTTT
10. Visit your app with `heroku open`!

Heroku Cheatsheet
---------------------------------
* `heroku logs` view server logs.
	* Note that these will be full of color escape code garbage.
* `heroku ps` will show the status of all running dynos.
* `git push heroku master` will kill all running dynos and run new ones in the same basic 'formation.'
* `heroku restart dyno_type.dyno_number` will restart a specific dyno.
	* [For more about dyno failure conditions, see this page.](https://devcenter.heroku.com/articles/dynos)
* `heroku config:set ENV_VAR_NAME= config_var_value` will set environment variables.
	* These are exposed to node as `process.env.ENV_VAR_NAME`.
	* Use this for things like encryption / SSL keys.
* `heroku run SCRIPT/PROCESS` will spin up a new dyno running the named script or process. This dyno will automatically die from inactivity later. Changes to the filesystem on one dyno are *not* propogated to other dynos; modify a shared resource (database, queue, etc.) instead. Additionally, new dynos are *always* created from a slug (ready-to-run format created when you deploy), *not* from the state of the other dynos.
	* You can `heroku run bash` for an interactive session.
* `heroku logs --ps web.1 --tail` view the logs from one dyno (named web.1) and keep the connection open.

Files Related to Heroku
---------------------------------
* `Procfile` defines process types run by `heroku ps:scale `type=number`
* `package.json` is used to build the app on heroku's servers. It must list *every* package used in the app; no packages can be used from global scope.

Unit Testing
---------------------------------
To run unit tests, `mocha` from the project directory. This will run the unit tests, then the integration tests.

Note that the unit tests WILL DELETE THE DATABASE!!! You have been warned. Also note that the integration tests require the Selenium web driver. The unit tests are conducted using mocha and should.js.

Coverage Reports
---------------------------------
Try `istanbul cover ./node_modules/mocha/bin/_mocha test/test.js -- -u exports -R spec` from project directory. This will produce a coverage report in ./coverage, which may or may not be of any use. Currently wonky.

Selenium Integration Testing
---------------------------------
Requires the google chrome driver to be present and on the system path. See instructions [here](http://simpleprogrammer.com/2014/02/03/selenium-with-node-js/). Selenium tests are automatically run as part of the full mocha test suite. If the integration tests cause mocha to time out, pass it a custom timeout variable as `mocha --timeout verylargenumberinmilliseconds` or `mocha specifictest -timeout verylargenumberinmilliseconds`.

Performance Profiling
---------------------------------
On startup, the web app runs a `look` server, which profiles and monitors response time, CPU usage, memory usage, errors, and stack traces. Connect to it via the web app's normal hostname at port 5959 (i.e., 127.0.0.1:5959 or aherokuwebapp.com/moreurl:5959). Note that it has NOT been tested on heroku.

Load / Stress Testing
---------------------------------
Stress testing can be done with `loadtest`, which provides an apache benchmark-esque CLI. To use it, try `loadtest -c numberOfSimultaneousConnections --rpm requestsPerMinute protocol://url/`. For instance, a common stress test for a local dev deployment might be `loadtest -c 10 --rpm 200 http://localhost:3000/pollroute/listpolls`.

Testing the API Endpoints with Postman
---------------------------------
API testing has been done with the [Chrome extension Postman](https://chrome.google.com/webstore/detail/postman-rest-client/fdmmgilgnpjigdojojpjoooidkmcomcm?hl=en). `Basic Auth` should be used, and for many of the POST verb endpoints, you will need to add the header `Content-Type application/json`. Data should be POSTed in `raw` form. Note that this means that the keys in the object will need to be quoted. For example, to test posting to /register/, send the raw data: `{"username": "1234567", "password": "123412341234123412341234123412341"}`.

The Future
---------------------------------
* http://www.w3schools.com/html/html5_geolocation.asp
* http://stackoverflow.com/questions/15051712/how-to-do-authentication-with-a-rest-api-right-browser-native-clients
* http://stackoverflow.com/questions/176264/whats-the-difference-between-a-uri-and-a-url/1984225#1984225
* http://stackoverflow.com/questions/630453/put-vs-post-in-rest/630475#630475
* http://stackoverflow.com/questions/107390/whats-the-difference-between-a-post-and-a-put-http-request
* http://stackoverflow.com/questions/1058880/can-iphone-web-apps-get-gps-position
* http://ionicframework.com/getting-started/

Subtree Workflow
---------------------------------
creating the subtree
	http://blogs.atlassian.com/2013/05/alternatives-to-git-submodule-git-subtree/
do work
	git add .
	git commit
update the subtree
	git subtree pull --prefix=v11n v11n master
use split to create a new subtree history
	git subtree split --prefix=v11n --annotate="(split) " --rejoin
push that subtree history
	git subtree push --prefix=v11n v11n master --squash
deleting subtrees
	git rm -r v11n

Jade syntax highlighting
---------------------------------
If you use sublime, see this conversation: https://raw.githubusercontent.com/miksago/jade-tmbundle/master/Syntaxes/Jade.tmLanguage
and this file: https://raw.githubusercontent.com/miksago/jade-tmbundle/master/Syntaxes/Jade.tmLanguage

Known Issues
---------------------------------
* `server_stdout.log` contains color escape codes and other garbage.
	* Similarly, heroku logs for a running server are almost unreadable because of color codes.
* Skype defaults to listening on port 443, blocking server.js from starting the HTTPS server.
* MongoDB under Mac OSX will not get as many file descriptors as it would like.
	* See: http://docs.mongodb.org/manual/reference/ulimit/
* None of the HTTPS keys are packaged with the app. Generate them like so:

	`openssl genrsa -out polljs-key.pem 1024`

	`openssl req -new -key polljs-key.pem -out certrequest.csr`

	`openssl x509 -req -in certrequest.csr -signkey polljs-key.pem -out polljs-cert.pem`