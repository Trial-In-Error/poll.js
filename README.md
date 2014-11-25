vistool
=======
A small javascript library for visualizing, graphing, and charting!

Example Use
-------
1. Serve the visualization library with the page:
`<script src="/some/path/to/v11n.min.js" charset="utf-8"></script>`
2. Have a div somewhere in the page with an id to load the visualization into. The visualization will be created scaled to the div's size when the library is called.
`<div id='someUniqueID'></div>`
3. Call the library. The generic form is maggio.flashpollVis(addressString, questionIndex, divIDString, optionsArray). For example, the below call will load question 0 from a poll at some.origin and create the visualization in the div with id chart1.
`<script type="text/javascript">
maggio.flashpollVis("http://some.origin/flashpoll/api/v1/poll/7111bf32-4a8c-40c6-9e2c-b503643", 0, "#chart1",[]);
</script>`

API
-------

Building
-------
Building this library requires node and grunt. To build it, navigate to the project directory and type `npm install` to install the grunt packages needed. Then, type `grunt` or `grunt human` to produce a human-readable version of the library, or `grunt dist` to produce a minified, mangled version suitable for a production environment. The files are named `v11n.js` and `v11n.min.js` respectively, and are created at the project's top level. All of the other files present in the repository are for development / testing.

Testing
-------
The example page, chooser.html, can be viewed by hosting it on a server. An easy way to set it up is to install node's simple-server with `npm simple-server`. Then, run it with `simple-server` and view it by opening up a browser, navigating to `http:localhost:3000`, and locating chooser.html. By default, it's found at `http://localhost:3000/v11n/chooser.html`. 

Contact
-------
If you have any problems or feature requests, please record them in the github issue tracker.