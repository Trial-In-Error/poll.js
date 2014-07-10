poll.js
=======
To install:

1. Clone repository.

2. Install [mongoDB](http://www.mongodb.org/downloads). Add mongodb/bin to the system path.

3. Install [node.js](http://nodejs.org/download/). Add node.js/ to the system path.

4. From the repository's directory, `npm install`.

5. Get a coffee while npm does all the hard work.

6. Modify `package.json`'s prestart to point to the repository's data directory.

7. From the repository's directory, `npm start`.

8. Point a web browser at `localhost:3000` and enjoy!

Known Issues
------------
* server_stdout.log contains color escape codes and other garbage.