/**
* ################################ STATISTICAL METHODS ##################################################################
*/
var increase;
/**
* Performs linear regression
* returns array with points in the linear line
*/
function linearRegression(data, max){
	var linear_regression_line = ss.linear_regression()
	.data(data).line();
	increase = (linear_regression_line(1) -linear_regression_line(0)).toFixed(1);
	var d = new Array();
	var h = new Array();
	h.push(label[0][0]);
	d.push(label[1][0]);
	for(var i = 0; i<=max; i++){
		d.push(Math.round(linear_regression_line(i)));
		h.push(i);
	}
	return [h,d]
}
/**
* Calculates the p value from chi sqaure and degree of freedom
*/
function ChiSq(x,n) {
	if(n==1 & x>1000) {return 0}
		if(x>1000 | n>1000) {
			var q=ChiSq((x-n)*(x-n)/(2*n),1)/2
			if(x>n) {return q} {return 1-q}
		}
	var p=Math.exp(-0.5*x); if((n%2)==1) { p=p*Math.sqrt(2*x/3.14) }
	var k=n; while(k>=2) { p=p*x/k; k=k-2 }
	var t=p; var a=n; while(t>0.0000000001*p) { a=a+2; t=t*x/a; p=p+t }
	return 1-p
}
/*
*Preforms a chi square test on two categorical varibles
*param{array} matrix - array of array the contains data from two sets and catagory names
* 
*/
function chiSquareTest(matrix){
	var sValue = 0.05;
	var test = addTotal(matrix);
	var chimatrix = [];
	var chiSquare = 0;
	var df;
	var pvalue;
	for (var i = 1; i < test.length-1; i++) {
		var temp=[];
		for (var j = 1; j < test[i].length-1; j++) {
			var obj = new Object();
			obj["frequency"] = test[i][j];
			obj["E"] = calcExp( test[i][test[i].length-1] , test[test.length-1][j] , test[test.length-1][test[i].length-1]);
			obj["chi"] = calcChiPart(obj.E,obj.frequency);
			chiSquare += obj.chi;
			temp.push(obj);
		};
		chimatrix.push(temp);
	};
	df = (test.length-3) * (test[1].length-3);
	pvalue = ChiSq(chiSquare,df);
	// return pvalue
	return pvalue > sValue ? true : false;
}

function calcExp(rowtot, coltot, sampsize){
	return (rowtot*coltot)/sampsize;
}
function calcChiPart(expected,accual){
	return (Math.pow(accual-expected,2))/expected;
}
function addTotal(matrix){
	var m = [];
	m.unshift(matrix[0]);
	matrix.shift();
	m[0].push("total");
	var bottom = [];
	bottom.push("total");
	for (var i = 0; i < matrix.length; i++) {
		var tot=0;
		var temp = [];

		for (var j = 0; j < matrix[i].length; j++) {
			var obj = new Object();
			obj['frequency'] = matrix[i][j];
			temp.push(matrix[i][j]);
			if(j>0){
				tot += matrix[i][j];
				if(i==0){
					bottom.push(matrix[i][j])
				}else{
					bottom[j] += matrix[i][j];
				}
			}
		};
		temp.push(tot);
		m.push(temp);
		
	};
	var absTotal =0;
	for (var i = 1; i < m.length; i++) {
		absTotal += m[i][m[i].length-1];
	};
	bottom.push(absTotal);
	m.push(bottom);
	return m;
}