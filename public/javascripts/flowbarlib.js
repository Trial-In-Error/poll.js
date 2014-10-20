var matrix;
var groups;
var cat;
var current = 0;
  var chart = null;
function loadMatrixCSV(url,container){
	matrix = new Array();
	groups = new Array();
  cat = new Array();
	// cat = categories;
  // cat = categories;
  if(window.location.origin.indexOf('heroku')!== -1) {
    var username = "admin";
    var password = "admin";  
  } else {
    var username = "awkward";
    var password = "awkward";
  }
  

  console.log('Attempting to log in as '+username+', '+password);
  d3.csv(url).header("Authorization", "Basic " + btoa(username + ":" + password))
  .get(function(error,data) {
   console.log(data);
    // window.makeAccess = data;
    for(p in data[0]){
        cat.push(p);
    }
    console.log(cat);
  	data.forEach(function(d) {
      console.log(d);
      groups.push(d[cat[0]]);
      // var set = new Array();
       var mSet = new Array();
      // mSet.push(d[categories[0]]);
      for(var i = 0; i<cat.length;i++){
       
        // mSet.push(cat[i])
        mSet.push(d[cat[i]]);
        
      }

      matrix.push(mSet);
   console.log(matrix);
    });
    console.log(groups);
  	// matrix.unshift(groups);
  	// console.log(groups);
  	createVis(container,matrix,cat);
    groups = [];
    cat = [];
    matrix = [];
  });
}

function createVis(container,matrix,cat){
  console.log(matrix);
	isFirst = false;

	chart = c3.generate({
		bindto : container,
		x: cat[0],
		data: {
			columns: 
			matrix,
			type: 'bar',
		} ,
		axis: {
		        x: {
                  type: 'categorized'
		   /*     	label: 'åldersgrupp',
            tick: {
                format: function() {
                    var substitues = {
                        0: groups[0],
                        1: groups[1],
                        2: groups[2],
                        3: groups[3],
                        4: groups[4],
                        5: groups[5],
                        6: groups[6],
                        7: groups[7],
                        8: groups[8]
                    };
    
                        return substitues[current];
                }
            } */  
        },
        y: {
        /*	label: 'Procent',
            max: 100,
            min: 0,*/
        }
		},
    size: {
      height: 300,
      width: 400
    }
	});
}
function setBarset(set){
	current=set;
	// unload();
	loadData(set);

}
function unload(){
	    chart.unload({
    ids: cat,
	    });
}
function loadData(set){
	// console.log(matrix[set][0]);
	chart.load({
		columns: 
		[
		matrix[set][0],
		matrix[set][1],
		matrix[set][2],
		],
	
	});
}