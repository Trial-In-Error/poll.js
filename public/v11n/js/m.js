/**
* Returns the position of the value in the array
*param{Array} array - array to be searched
*param{var} value - value of the object whoms position is searched
*/
function getIndex(array, value){
	for(var i = 1; i < array.length; i++){
		if(value == array[i]){	
			return i;
		}
	}
	return null;
}
/**
* Returns the position of the value in the array
*param{Array} array - array to be searched
*param{var} value - value of the object whoms position is searched
*/
function getIndex2(array, value){
	for(var i = 1; i < array.length; i++){
		if(value == array[i]){	
			return i-1;
		}
	}
	return null;
}
/**
* Gets the headers of a matrix
*param{Array} array - array to be searched
*param{var} value - value of the object whoms position is searchedmas
*/
function columnNames(matrix){
	var ret= []; 
	
	for(var i = 0; i<matrix.length;i++){ret.push(matrix[i][0]);} 
		return ret;
}
function getSumMatrix(matrix){
	var sum=0;
	for(var i = 0; i<matrix.length; i++){
		sum += getSumArray(matrix[i]);
	}
	return sum;
}
function getSumArray(array,offset){
	var sum = 0 ;

	for(var j= offset; j<array.length; j++){
		sum += parseInt(array[j]);
	}
	if(sum==0){
		return 1;
	}
	return sum;
}

function matrixToArray(m){
	var array=[];
	for (var i = 0; i < m.length; i++) {
		for (var j = 1; j < m[i].length; j++) 
			array[(i*m[0].length)+j] = m[i][j];
	};
};
function getArrayMaxElement(a,offset){
	var max = 0;
	var ret = "";
	for (var i = offset; i < a.length; i++) {
		if(max<a[i].length){
			max=a[i].length
			ret=a[i];
		}
	}
	return ret;
}
function getArrayMax(a,offset){
	var max = 0;
	for (var i = 1; i < a.length; i++) {
		if(max<a[i].length){
			max=a[i].length;
			console.log(max);
		}
	}
	return max;
}
function getMatrixMax(matrix){
	var max = 0;
		for (var i = 1; i < matrix.length; i++) {
				if(max < getMax(matrix[i])){
					max = getMax(matrix[i]);
				} 
		}
	console.log("MATRIX MAX  " + max);
	return max;
}
function getMax(a){
		var max = 0;
	for (var i = 1; i < a.length; i++) {
		if(max<a[i]){
			max=a[i];
		}
	}
	return max;
}
function getRowMax(matrix,index,offset){
	var max = 0;
	for (var i = offset; i < matrix.length; i++) {
		if(max<matrix[i][index].length){
			max=matrix[i][index].length;
		}
	}
	return max;
}
/**
*
*/ 
function mergeQ(answers,meta){
	var returnvalue = addMetaToMatrix(buildDataMatrix(answers),meta);
	bar(returnvalue);
}
function buildDataMatrix(answers){
	var ret =[];
	answers.pollResultAnswers.forEach(function(d){
		ret.push([d.answerScore]);
	});
	return ret;
}

function addMetaToMatrix(ret,meta){
	var title = meta.questionText;
	addInfo(title,pollchart.nrOfCharts + 1);
	meta.answers.forEach(function(d){
		ret[d.orderId].unshift(d.answerText);
	});

	header  = ([title,"frequency"]);
	return ret;
}

function functionName(fun) {
  var ret = fun.toString();
  ret = ret.substr('function '.length);
  ret = ret.substr(0, ret.indexOf('('));
  return ret;
}

<<<<<<< HEAD
=======
function transformation(matrix,trans){
	if(trans == "swap"){
		
	}
}
>>>>>>> 0c089e8e7c6b18191eebf5cc58645a944976895f
