poll.js
================================

Installation
---------------------------------
1. Clone the repository (`git clone https://github.com/Trial-In-Error/poll.js`) or download the repository's contents as a zip file.
2. Install [mongoDB from here](http://www.mongodb.org/downloads) or with `sudo apt-get install mongoDB`. Add mongodb/bin to the system path. Opiner is known to work with version 3.0.2 of MongoDB.
3. Install [node.js from here](http://nodejs.org/download/) or with `sudo apt-get install nodejs`. Add node.js/ to the system path. Opiner is known to work with version 0.12.2 of nodeJS.
4. Install redis-server [for linux](https://github.com/antirez/redis) or [for windows](https://github.com/dmajkic/redis/downloads) or with `sudo apt-get install redis-server`. Add redis-server/ to the system path. Note that this step is optional but **highly** recommended. Opiner is known to work with version 2.4.5 of redis-server.
5. From the repository's directory, `npm install`.
6. Get a coffee while `npm` does all the hard work. (Note that if npm fails, re-running it will often cause the installation to proceed).
7. Start the app from the repository's directory with `npm start`.
8. Point a web browser at `localhost:3000` and enjoy!

Note that `npm run godbless` will start the server but not start redis or mongodb. This is useful for debugging changes without having to deal with `redis`, `mongodb`, and `forever`.

Adding an Admin User
---------------------------------
1. Start the server with `npm run`. This will start a mongo database.
2. Create a normal user via the web interface at /login.
3. Access the database's shell from the `poll.js` directory with the command-line instruction `mongo`.
4. Choose the mongo database for this project with `use polljs`.
5. Promote the user to an admin by `db.userdb.update({"type.login.username":"<username>"}, {$set: {"rights.<desiredRight>":true}})`. Note that you will have to do this for each right you wish to give to the admin.

Documentation for the mongo CLI [can be found here.](http://docs.mongodb.org/manual/reference/mongo-shell/) The full set of rights can be added with `db.userdb.update({"type.login.username": "<username>"}, {$set: {"rights": { "answer": true, "delete": true, "openClose": true, "accessClosed": true, "getAnswers": true, "create": true}}})`.

Note that, because of the way session based authentication is done, the user will have to log back in after being promoted in order to have access to their new rights.

Adding a Poll via the Database
---------------------------------
1. Write a poll as a valid `.json` file, corresponding to the data model in `datamodel.md`.
2. From the terminal, `mongoimport --db polljs --collection polldb --jsonArray < example_poll.json`.

Note that many example polls are provided in /polls.

Adding a Poll via the Webapp
---------------------------------
1. Write a poll as a valid `.json` file, corresponding to the data model in `datamodel.md`.
2. Log into the web app with an admin account (the app should be running at `localhost:3000/login` or `yourdeploymentname.herokuapp.com/login`).
3. Navigate to `localhost:3000/importpoll` (or `yourdeploymentname.herokuapp.com/importpoll`), paste the `.json` file into the textfield, and hit submit.

Creating a Poll via the Webapp
---------------------------------
1. Log into the web app with an admin account.
2. Navigate to `localhost:3000/createpoll`.
3. Follow the prompts. The create poll interface is not quite as robust as manually editing the JSON; for instance, manual editing allows for branching and forking polls, while the create poll interface does not.

Deploying to Heroku
---------------------------------
1. [Sign up for heroku.]( https://signup.heroku.com/signup/dc)
2. [Download and install the heroku toolbelt.](https://toolbelt.heroku.com/)
3. Authenticate with heroku using `heroku login`.
4. Commit changes via git with `git commit -m "trying heroku deployment!"`.
5. Create a heroku project with `heroku create`.
6. Deploy code with `git push heroku master`.
7. Start one dyno (worker process) with `heroku ps:scale web=1`.
8. Find a MongoDB-as-a-service provider [here](https://addons.heroku.com/) and follow their setup instructions. This project initially used MongoLab's free service.
9. Find a redis-as-a-service provider [at the same place](https://addons.heroku.com/) and follow their setup instructions. This project initially used redisCloud's free service.
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

About Redis
---------------------------------
If the server can find a running redis-server, it will use that as the session memory store (redis behaves much like memcached). Testing can be done without redis-server running (as the server will fall back on node's default memory store), but production environments should *absolutely* use redis! Memory store cannot sync memory between multiple processes (so Heroku cannot scale past 1 dyno and still use sessions!) and has an inherent memory leak (sessions are **never** released from memory). So please use redis, even though it's listed as optional above.

Hack This Thing
---------------------------------
An overview of the whole system, detailed explanations of its parts, help with the development tools, warnings, etc., can all be found on [the github wiki](https://github.com/Trial-In-Error/poll.js/wiki). Good luck!

License Information
---------------------------------
Everything included in this repository is permissively (e.g., MIT) licensed except for Isotope and Packery. If you wish to use the grid (/grid or /grid/:id), [check here](http://packery.metafizzy.co/license.html) to to see if your use is fair use, or if you should buy a license. If your use is not fair use, you will need two licenses, [one for packery](http://packery.metafizzy.co/license.html) and [a second for isotope](http://isotope.metafizzy.co/license.html).

Notes
---------------------------------
* The HTTPS server is currently inactive. Turn it on by providing certificates (as documented below) and uncommenting lines 41-45 in /bin/server.js.
	* Note that the HTTPS server will cause Heroku deployments to crash. Cause un-investigated.
* Skype defaults to listening on port 443, blocking server.js from starting the HTTPS server.
* MongoDB under Mac OSX will not get as many file descriptors as it would like.
	* See [this note](http://docs.mongodb.org/manual/reference/ulimit/).
* None of the HTTPS keys are packaged with the app. You can generate self-signed certificates like so:

	`openssl genrsa -out polljs-key.pem 1024`

	`openssl req -new -key polljs-key.pem -out certrequest.csr`

	`openssl x509 -req -in certrequest.csr -signkey polljs-key.pem -out polljs-cert.pem`
