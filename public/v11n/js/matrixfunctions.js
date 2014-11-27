function matrixToRevArray(matrix){
	var ret = [];
	for (var i = 0; i < matrix.length; i++) {
				// ret.push(matrix[i][matrix[i].length-1]);
		for (var j = 1; j <matrix[i].length; j++) {
			// ret.push(matrix[i][j]);
			ret.push({col:i,row:j-1, value: matrix[i][j]})
		};

		console.log(ret);
	};
	return ret;
}
function arrayToString(array){
	var res = "";
	for (var i = 0; i < array.length; i++) {
		if(i>0){
			res += "+" + array[i];
		}else{
			res += ""+array[i];
		}

	};
	return res;
}
	/**
* Makes histogram of data **
*param{Array} matrix - array holding the table
*/
function disk(data){
	var header = new Array();
	var bucketsize =5;
	var head = data.splice(0,1);
	var buckets = new Array(bucketsize);
	var min = Math.min.apply(Math, data),
	max = Math.max.apply(Math, data);
	console.log(min);
		console.log(max);
	var diff = max - min;
	var step = parseInt(max/bucketsize);
	console.log(step);
	for(var i = 0; i <= bucketsize; i++){
		buckets[i]=0;
		var minm =  (step*i).toString();
		console.log(minm);
		var maxm =  (step*(i+1)).toString();
		// header[i] = minm.substring(0,4) + "-" +maxm.substring(0,4);
		header[i] = minm.split('.')[0] + "-" +maxm.split('.')[0];
				console.log("min " + step*i);
			console.log("max " + step*(i+1));
		for(var j = 0; j < data.length; j++){
	// console.log("data " + data[j]);
			if(step*i<data[j] && step*(i+1) > data[j]){
				buckets[i]+=1;
			}
		}
		console.log(buckets);
	}
	// buckets.unshift(head[0])
	buckets.unshift("Freqency")
	var ret = [];
	ret.push(header);
	ret.push(buckets);
	return [ret,step];
}
/**
* Transform matrix into datapoints
* [x-array,y-array]
* into
* [[x1,y1],[x2,y2],...,[xn,yx]]
*
* To perform a linear regression.
*
* returns lables + linearRegression in an array
*/
function matrixToPoints(matrix){

	label.push(matrix[0].splice(0,1));
	label.push(matrix[1].splice(0,1));
	var data= new Array();
	var max = 0;
	for(var j = 0; j<2; j++){
		for(var i = 0; i<matrix[0].length; i++){
			if(j==0){
				data[i]=new Array();
			}
			data[i].push(Math.round(matrix[j][i]));
			
		}
		if(max < ss.max(matrix[0])){
			max = ss.max(matrix[0]);
		}
	}
	return [label,linearRegression(data, max)];
}
/**
*
*/
function getAverage(matrix){
	var mat,temp;
	mat=[];
	for(var j = 0; j<matrix.length; j++){
		temp=[];
		for(var i = 1; i<matrix[0].length; i++){
			temp.push(matrix[j][i]*(1));
		}
		mat[j]=temp;
		mat[j].unshift(matrix[j][0])
	}
	return matrix;
}
/**
* Stepvice stack columns
* [[A,B,C],[D,E,F]]
* to
* [[A,B,C],[A+D,B+E,C+F]]
* This is used for dispaying the distribution over time
*
*/
function normalizeArea(matrix){
	for(var i = 0; i<matrix.length; i++){
		for(var j = 1; j<matrix[i].length; j++){
			if(i != 0){

				matrix[i][j] += matrix[i-1][j];
			}
		}
	}
	return matrix;
}

// function normalizeMatrix(matrix){
// 	var sum = getSumMatrix(matrix);
// 	for(var i = 0; i<matrix.length; i++){
// 		for(var j= 0; j<matrix[i].length; j++){
// 			matrix[i][j] = (matrix[i][j]/sum).toFixed(2);
// 		}
// 	}
// 	return matrix;
// }
/**
* Adds a chart to the array of charts and returns the position of the chart
*/
function addChart(chart){
	matrixArray.push(chart);
	return matrixArray.length-1;
}

/**
* Normalize a datamatrix without a top header as first row
* First coloumn is text
*/
function normalize (matrix,offset){
	var ratio =0;
	var temp;
	var result = [];
	for (var i = offset; i < matrix.length; i++) {
		for (var j = 1; j < matrix[i].length; j++) {
			temp = matrix[i][j];
			if(temp > ratio){
				ratio = temp;
			}
		};
	};
	ratio = ratio/100;
	result.push(matrix[0]);
	for (var i = offset; i < matrix.length; i++) {
		result[i] = new Array();
		result[i].push(matrix[i][0]);
		for (var j = 1; j < matrix[i].length; j++) {
			result[i][j] = Math.round(matrix[i][j]/ratio);
		};
	};
	console.log(result);
	return result;
}
/**
* Normalize a datamatrix without a top header as first row
* First coloumn is text
*/
/*function normalizeByColumn(matrix){
	var result = [];
	result.push(matrix[0]);
	for (var i = 1; i < matrix.length; i++) {
		var temp=[];
		for (var j = 1; j < Things.length; j++) {
			matrix[i][j]
		};
		result.push(normalizeRow(matrix[i]));
	};
	return result;
}*/
/**
* Normalize a datamatrix without a top header as first row
* First coloumn is text
*/
function normalizeByRow (matrix){
	var result = [];
	result.push(matrix[0]);
	for (var i = 1; i < matrix.length; i++) {
		result.push(normalizeRow(matrix[i]));
	};
	return result;
}
function normalizeRow(array){

	var max = getArrayMax(array.slice(1,array.length),0);
	var sum = getSumArray(array,1);
	for (var i = 1; i < array.length; i++) {
		var value = parseInt(array[i]);
		array[i] = Math.round(value/sum*100);
	};
	return array;
}
function normalizeColumns(matrix){
	var m = swapCategorical(matrix);
	m = normalizeByRow(m);
	return swapCategorical(m);
}

function averageByRow(matrix){
	for (var i = 0; i < matrix.length; i++) {
			// matrix[i] = matrix[i][]
		};
	}
	/**
* adds the an array at the first row of the matrix
*/
function addTopHeadToMatrix(names){
	var a = [];
	a.push("Title");
	names.forEach(function(d){
		a.push(d.answerText);
	});
	return a;
}
function addToSideHeadMatrix(names,matrix){
	for (var i = 0; i < names.length; i++) {
		matrix[i].unshift(names[i].answerText);
	};
	return matrix;
}
function buildEmptyMatrix(rows,columns){
	var m = [];
	for (var i = 0; i < rows; i++) {
		m[i] = new Array();
		for (var j = 0; j < columns; j++) {
			m[i].push(0);
		};
	};

	return m;
}
	 function addSideNames(matrix,names){
					for (var i = 0; i < matrix.length; i++) {
						matrix[i].unshift(names[i]);
					};
					return matrix;
				};
			
	function getListOfCharts(q,single){
					var val;
					var categorical = 0;
					var continuous = 0;
					console.log(q);
					for (var i = 0; i < q.length; i++) {
						val = opine.dataTypes[q[i]];
						if(val == "nominal" ){
							categorical++
						}else if(val=="ratio"){
							continuous++;
						}
					};
					return getvistypes(categorical,continuous,single);
				};

function swapCategorical(matrix){
	var retMatrix=[];
	for (var i = 0; i < matrix[0].length; i++) {
		var temp = [];
		for (var j = 0; j < matrix.length; j++) {
				temp.push(matrix[j][i]);
		};
					retMatrix.push(temp);
	};
	return retMatrix;
}
function copyMatrix(matrix){
	var newArray = [];

for (var i = 0; i < matrix.length; i++){
    newArray[i] = matrix[i].slice();
}
return newArray;
}
function addToSideHeader(matrix,add){
	for(var i = 0; i<matrix.length;i++){
		matrix[i][0]+=add;
	} 
		return matrix;
}

function transformation(matrix,trans){

	if(trans == null){
		return matrix;
	}

	var m = copyMatrix(matrix);

	if(trans == "swap"){
		m = swapCategorical(m);
	}else if(trans == "p1"){
		m = normalizeColumns(m);
	}else if(trans == "p2"){
		m = normalizeByRow(m);
	}
	return m;
}