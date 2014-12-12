/*
* Cointains color scheme for the and function to get a color
*/
var datacolors = {
	colors : [
	['#02A79C','#88CBC4','#1F4557','#8FC043','#D2E090','#5A6C40','#EF921A','#F1DB71'],
	['#8FC043','#D2E090','#5A6C40','#F2F7D8','#EF921A','#F1DB71','#901F2F','#FFF608'],
	['#EF921A','#F1DB71','#901F2F','#FFF608','#D12A09','#6A2383','#9360A4','#5F5858'],
	['#D12A09','#6A2383','#9360A4','#5F5858','#02A79C','#88CBC4','#1F4557','#8FC043'],
	],
	//Background color of tiles
	tileBackground :  '#FFF6c8',
	highlightColor : "#EE474D",
	curretGroup : 0,
	count : 0,
	getColor : function(group,names,options){
		var currColor = options.color;
		index = 0;
		datacolors.index = (datacolors.index + 1) % (datacolors.colors[0].length);
		if($.inArray(group,names) != -1){
			return datacolors.colors[currColor][getIndex2(names,group)];
		}else {
			//if users choice
/*			if(options.answer != null){
				console.log(options.answer);
				if(group.id==options.answer || group == options.answer){
				var answer = stripPunctuationAndHyphenate(options.answer);
				$(".c3-legend-item-" +answer+"- .c3-legend-item-tile").css("fill",this.highlightColor)
				return this.highlightColor;
			}
		}*/
				return datacolors.colors[currColor][getIndex2(names,group.id)];

					// }
				}

			}
		}

function stripPunctuationAndHyphenate(string) {
return string.replace(/[\.,\\/#!$%\^&\*;:{}=_`~()]/g,"").replace(/\s{2,}/g,"-");
}
