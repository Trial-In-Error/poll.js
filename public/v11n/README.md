vistool
=======
A small javascript library for visualizing, graphing, and charting!

<<<<<<< HEAD
=======
***NOTE: The username and password for authentication are not stored in the library. For authentication to work, please create the file config/config.js with the contents listed below:***

    var config = { user: someuser, password: somepassword }

***Then, concatenate config.js to v11n.js and v11n.min.js or use the grunt pass task (`grunt pass`) to concat for you.***

>>>>>>> 0c089e8e7c6b18191eebf5cc58645a944976895f
Example Use
-------
1. Serve the visualization library with the page:
    `<script src="/some/path/to/v11n.min.js" charset="utf-8"></script>`
2. Serve the CSS required by the library with the page:
    `<link href="css/c3.css" rel="stylesheet">`
    `<link href="css/chart.css" rel="stylesheet">`
3. Serve jQuery in conflict mode. This should be included in the HTML before serving the visualization library:
    `<script src="some/path/to/jQuery/jQuery.min.js'></script>`
4. Have a div somewhere in the page with an id to load the visualization into. The visualization will be created scaled to the div's size when the library is called.
    `<div id='someUniqueID' style ='height:350px; width:350px;'></div>`
The height and width styles are only required for heatmap visualizations.
5. Create a new object of type `visualizeFlashPoll`, then call its `flashChart` method. The generic form is:
`visualizeflashpollinstance.flashChart(urlString, questionIDsArray, divIDString, nameOfChartString, optionsObject)`. Alternatively, you can call `visualizeflashpollinstance.initLocal(url,callback)`, calling `visualizeflashpollinstance.chart(questionIDsArray, divIDString, nameOfChartString, optionsObject)` inside the callback.

Example of execution:
    
    // Use .flashChart() to fetch data and then chart it
    var vistool = new visualizeFlashPoll();
    // This will create a bar chart from question id 1 and render it in the HTML element with the id "container"
    vistool.flashChart("http://some.origin/flashpoll", [1], "#container",
    "bar", { axis : false });

    // Use init(callback chart()) to fetch data and then chart multiple graphs off the one GET
    var vistool = new visualizeFlashPoll();
    vistool.init("http://some.origin/flashpoll",function() {
        // Render a horizontal bar chart from question id 0
        vistool.chart([0],"#chart1","bar", {color: 0, title: "barchart question id 0", transformation: "swap"});
        // Render a pie chart from question id 1
        vistool.chart([1],"#chart1","pie", {color: 0, title: "pie question id 1"});
        // Render a donut chart from question id 2
        vistool.chart([2],"#chart1","donut", {color: 0, title: "donut question id 2"});
    });

Notes
* There are no visualizations for free text questions.
* A maximum of two questions can be combined (i.e., the questionIDsArray cannot be longer than two entries).

API
-------
###visualizepoll functions

Note that the API is subject to lots of change. Be careful when pulling new versions of the library if you need to maintain backwards compatibility (i.e., in production)!

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

####init(url, callback)
Loads data and then executes the callback

1. String - url to the origin of the three json files, frequency, result and results.
2. Callback with function chart etc.

####initlocal(url, callback)
As per init, but uses local data (i.e., a JSON file with a relative path to it using the file system).

####chart(questionIndexArray, containerID, chartFunctionName)
Must be executed inside init or initlocal callback.

1. Array[int] - containing the id of the questions to visualize
2. String - the div container id
3. String -  name of chart function
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
4. Object - Object containing options for the chart
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

####quickOverview(container, options)
Slideshow over the answer distribution of all the questions. This method must be executed inside the init callback.

1. String - the div container id
2. Object - Object containing options for the chart (same as above)

Building
-------
Building this library requires node and grunt. To build it, navigate to the project directory and type `npm install` to install the grunt packages needed. Then, type `grunt` or `grunt human` to produce a human-readable version of the library, or `grunt dist` to produce a minified, mangled version suitable for a production environment. The files are named `v11n.js` and `v11n.min.js` respectively, and are created at the project's top level. There are two css files in ./css/ that should also be served. All of the other files present in the repository are for development / testing.

Testing
-------
The example page, `./flashpolltest/charttest.html`, can be viewed by hosting it on a server. An easy way to set it up is to install node's simple-server with `npm simple-server`. Then, run it with `simple-server` and view it by opening up a browser, navigating to `http:localhost:3000`, and locating `charttest.html`. By default, it's found at `http://localhost:3000/flashpolltest/charttest.html`. Any other simple server solution (WAMP, etc) will work as well. Note that any server listening on port 3000 will cause simple-server to crash with an exception!

How are questions combined?
-------
Data from a maximum of two questions can be combined, how they are combined depends of the the question's type. 

1. Two Order questions -> The score from each combination are sumed.
2. One Order question and one radio/checkbox, the two questions are multiplied and then added.
3. Two question of non Order, the frequency of respone is counted for each combination.

For these functions can be overritten for customiaztion of data mangement. Names of functions in respective order,
flashpoll.mergeOrder, flashpoll.mergeOneOrder and flashpoll.mergeNominal

Example how to change

    flashpoll.mergeOneOrder = function(a,b){
      return 0;};


Contact
-------
If you have any problems or feature requests, please record them in the github issue tracker.
