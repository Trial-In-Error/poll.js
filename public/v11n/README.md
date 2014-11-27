vistool
=======
A small javascript library for visualizing, graphing, and charting!

Example Use
-------
1. Serve the visualization library with the page:
    `<script src="/some/path/to/v11n.min.js" charset="utf-8"></script>`
2. Serve the CSS required by the library with the page:
    `<link href="css/c3.css" rel="stylesheet">`
    `<link href="css/chart.css" rel="stylesheet">`
3. Have a div somewhere in the page with an id to load the visualization into. The visualization will be created scaled to the div's size when the library is called.
    `<div id='someUniqueID' style ='height:350px; width:350px;'></div>`
The height and width styles are only required for heatmap visualizations.
4. Create a new object of type `visualizepoll`, then call its `flashChart` method. The generic form is:
       visualizepollinstance.flashChart(urlString, questionIDsArray, divIDString, nameOfChartString, optionsObject)

Example of execution:

    var vistool = new visualizepolls();
    vistool.flashChart("http://some.origin/flashpoll", [1], "#container",
    "bar", { axis : false });

The call above will load question 1 from a poll at some.origin and create the visualization with no axes in the div with the id "container".

Notes
* There are no visualizations for free text questions.
* A maximum of two questions can be combined (i.e., the questionIDsArray cannot be longer than two entries).

API
-------
###visualizepoll functions

####flashChart(URL, questionIndexArray, containerID, chartFunctionName)

Parameters

1. String - url to the origin of the three json files, frequency, result and results.
2. Array[int] - containing the id of the questions to visualize
3. String - the div container id
4. String -  name of chart function
    * Currently available chart funtion (parameter 4)
        * bar
        * pie
        * lineCat
        * heatmap
        * stackedbar
    * Only for continuous data (will not work with the example flashpoll data)
        * histogram
        * scatter 
        * bubble
        * line 
        * regressionline
5. Object - Object containing options for the chart
    * Add options to chart editing these keys for the options parameter
        * tooltip : true/false
        * legend : true/false
        * axis : true/false
        * colorscheme : int (0-3) 0:cold, 1: nature, 2: warm, 3: fantasy
        * xlabel : label for x-axis
        * ylabel : label for y-axis
        * interaction :true/false
        * title : String, title of chart
        * transformation : 
            - "swap" switch place of datasets
            - "p1" normalize question 1
            - "p2" normalize question 2

Building
-------
Building this library requires node and grunt. To build it, navigate to the project directory and type `npm install` to install the grunt packages needed. Then, type `grunt` or `grunt human` to produce a human-readable version of the library, or `grunt dist` to produce a minified, mangled version suitable for a production environment. The files are named `v11n.js` and `v11n.min.js` respectively, and are created at the project's top level. There are two css files in ./css/ that should also be served. All of the other files present in the repository are for development / testing.

Testing
-------
The example page, chooser.html, can be viewed by hosting it on a server. An easy way to set it up is to install node's simple-server with `npm simple-server`. Then, run it with `simple-server` and view it by opening up a browser, navigating to `http:localhost:3000`, and locating chooser.html. By default, it's found at `http://localhost:3000/v11n/chooser.html`. Any other simple server solution (WAMP, etc) will work as well. Note that any server listening on port 3000 will cause simple server to crash with an exception!

How are questions combined?
-------
Magic! Science! Etc!

Contact
-------
If you have any problems or feature requests, please record them in the github issue tracker.