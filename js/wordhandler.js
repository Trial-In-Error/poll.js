var numberText = {
	single : "",
	hundred : "per hundred",
	thousand : "per k",
	tenthousand : "per 10K",
	hundredthousand : "per 100K"
}

var textformat = {
		numberShorten : function(value){
			var length = value.toString().length;
			if(value < 100){
				return [1, numberText.single];
			}else if(value < 1000){
				return [100,numberText.hundred];
			}else if (value < 10000){
				return [1000,numberText.thousand];
			}else if (value < 100000){
				return [10000,numberText.tenthousand];
			}else if (value < 100000){
				return [100000,numberText.hundredthousand];
			}
		}
		
}

String.prototype.trunc = String.prototype.trunc ||
      function(n){
          return this.length>n ? this.substr(0,n-1)+'...' : this.toString();
      };
/**
* 
*/
var getWordWidth = function(word){
	$('body').append("<div class='c3' id='textw'>"+word+"</div>");
	var width = $('#textw').width();
	$('#textw').remove();
	return width;
}
var getWordWidth2 = function(word){
	$('body').append("<div class='c3-axis' id='textw'>"+word+"</div>");
	var width = $('#textw').width();
	$('#textw').remove();
	return width;
}
var getWordHeight = function(word){
	$('body').append("<div class='c3' id='textw'>"+word+"</div>");
	var height = $('#textw').height();
	$('#textw').remove();
	return height;
}