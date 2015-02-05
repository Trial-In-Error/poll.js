var transformer = {

	deleteChart : function(id){

	},
	deleteContainer : function(id){

	},
	redraw : function(index,options){
		optionHandler.array[index].chart(optionHandler.array[index]);
	},
/*	addChartInfo : function(id){
		
		var index = id.split("tumb").slice(-1)[0];
		console.log(id);
			var ind = parseInt(index)+1;

		transformer.setTransButtons(optionHandler.array[index],index);

		if(optionHandler.array[index].independence==true){
			$("#tumb" + index).prepend("<p id='relation"+index+"' class='relation'>"+optionHandler.array[index].independence+"</p>");
		}
		
		$("#tumb" + index).prepend("<p id='title"+index+"' class='titleText'>"+optionHandler.array[index].info+"</p>");
		$("#tumb" + index).prepend("<h2 id='info"+index+"'	class='infoText'>"+optionHandler.array[index].title+"</h2>");


			var newHeight = $("#tumb" + index).height() -  $(".titleText").height() -  $(".infoText").height() 
			-parseInt($('.titleText').css('margin-top'))
			-parseInt($('.infoText').css('margin-top'))
			-parseInt($('.titleText').css('margin-bottom'))
			-parseInt($('.infoText').css('margin-bottom'));
		
			console.log(functionName(optionHandler.array[index].chart) );
			if(functionName(optionHandler.array[index].chart) != "pie"){
				newHeight = newHeight- $('#btnswap' + index).height() 
				-parseInt($('#btnswap' + index).css('padding-bottom'))	
				-parseInt($('#btnswap' + index).css('padding-top'));
			}
						if(optionHandler.array[index].independence==true){
			newHeight
		}
			// var newHeight = $("#charty" + ind).parent().width() - ($("#charty" + ind).parent().width() - $("#charty" + ind).height())
			console.log(newHeight);
		
			console.log(ind);
			$("#charty" + ind ).css('height',newHeight);
			$("#charty" + ind ).css('max-height','none');
			$("#charty" + ind ).css('width',$(id).width());
		if(optionHandler.array[index].classname == "tumbheat"){
			d3.select("#tumbheat" + index).remove();
			// console.log("tumbheat" + optionHandler.array[index].container);
					// transformer.setTransButtons(optionHandler.array[index],index);
/*
			if(optionHandler.array[index].independence!=null){
				$("#tumb" + index).prepend("<p id='relation"+index+"' class='relation'>"+optionHandler.array[index].independence+"</p>");
			}

			$("#tumb" + index).prepend("<p id='title"+index+"' class='infoText'>"+optionHandler.array[index].info+"</p>");
			$("#tumb" + index).prepend("<h2 id='info"+index+"'	class='titleText'>"+optionHandler.array[index].title+"</h2>");

			heatmap2(optionHandler.array[index],newHeight);
			return;
		}
		*/


		addChartInfo : function(id){

			var index = id.split("tumb").slice(-1)[0];
			console.log(id);
			var ind = parseInt(index);

			transformer.setTransButtons(optionHandler.array[index],index);
			if(optionHandler.array[index].independence==false){
				$("#tumb" + index).prepend("<p id='relation"+index+"' class='relation'>"+optionHandler.array[index].independence+"</p>");
			}

			$("#tumb" + index).prepend("<p id='title"+index+"' class='titleText'>"+optionHandler.array[index].info+ "</p>");
			$("#tumb" + index).prepend("<h2 id='info"+index+"' class='infoText'>"+optionHandler.array[index].title+"</h2>");

			var newHeight = $("#tumb" + index).height() -  $(".titleText").height() -  $(".infoText").height()
			-parseInt($('.titleText').css('margin-top'))
			-parseInt($('.infoText').css('margin-top'))
			-parseInt($('.titleText').css('margin-bottom'))
			-parseInt($('.infoText').css('margin-bottom'))

			if($('#btnshare'+index).length!==0) {
				console.log("REMOVING THE v");
				newHeight -= $('#share'+index).height()
				newHeight -= parseInt($('#btnshare'+index).css('padding-top'))
				newHeight -= parseInt($('#btnshare'+index).css('padding-bottom'))
				newHeight -= parseInt($('#btnshare'+index).css('margin-bottom'))
				newHeight -= parseInt($('#btnshare'+index).css('margin-top'))
			}
			if($('#btnswap'+index).length !== 0) {
				newHeight -= $('#btnswap' + index).height()
				newHeight -= parseInt($('#btnswap' + index).css('padding-top'))
				newHeight -= parseInt($('#btnswap' + index).css('padding-bottom'))
			}
			if($('#relation'+index).length!==0) {
				newHeight -= $('#relation'+index).height()
				newHeight -= parseInt($('#relation'+index).css('padding-top'))
				newHeight -= parseInt($('#relation'+index).css('padding-bottom'))
			}
			console.log("KOLLA HÄR >>>>>" + $("#tumb" + index).height());
			console.log("KOLLA HÄR >>>>>" + newHeight);

//-parseInt($('#btnswap' + index).css('padding-bottom'));
// var newHeight = $("#charty" + ind).parent().width() - ($("#charty" + ind).parent().width() - $("#charty" + ind).height())

console.log(ind);
$("#charty" + ind ).css('height',newHeight);
$("#charty" + ind ).css('max-height','none');
$("#charty" + ind ).css('width',$(id).width());

if(optionHandler.array[index].classname == "tumbheat"){

	d3.select("#tumbheat" + index).remove();
// transformer.setTransButtons(optionHandler.array[index],index);
/*
if(optionHandler.array[index].independence!=null){
$("#tumb" + index).prepend("<p id='relation"+index+"' class='relation'>"+optionHandler.array[index].independence+"</p>");
}

$("#tumb" + index).prepend("<p id='title"+index+"' class='infoText'>"+optionHandler.array[index].info+"</p>");
$("#tumb" + index).prepend("<h2 id='info"+index+"' class='titleText'>"+optionHandler.array[index].title+"</h2>");*/

heatmap2(optionHandler.array[index],newHeight);
return;
}


		// $(id).css('height',"" + $("#tumb" + index).height() -  $(".title").height() -  $(".info").height() - $(".swap").height());
		// var newHeight = $("#tumb" + index).height() -  $(".titleText").height() -  $(".infoText").height()*2 - $(".swap").height();
		// console.log(newHeight);
	/*	var ind = parseInt(index)+1;
		console.log(ind);
		$("#charty" + ind ).css('height',newHeight);
		$("#charty" + ind ).css('width',$(id).width());
		$("#charty" + ind ).css('max-height','none');*/
		// $(id).height($("#tumb" + index).height() -  $(".title").height() -  $(".info").height() - $(".swap").height());
		optionHandler.array[index].legend=true;
		optionHandler.array[index].tooltip = true;
		optionHandler.array[index].axis = true;
		optionHandler.array[index].interaction = true;
// optionHandler.array[index].container = id;
		// transformer.setTransButtons(optionHandler.array[index],index);
		
		// $(id).height($("#tumb" + index).height - $(".titleText").height() - $(".infoText").height() - - $(".infoText").height());
		
		optionHandler.array[index].tumb = false;
		var chart = optionHandler.array[index].chart(optionHandler.array[index]);
		optionHandler.array[index].c3 = chart;

		

	},
	removeInfo : function(id){
		$(".infoText").remove();
		$(".titleText").remove();
		$(".share").remove();
		$(".swap").remove();
		$(".norm").remove();
		console.log(id);
		$(id+' :not(.tumbchart):not(.tumbchart *)').remove();

		var index = id.split("tumb").slice(-1)[0];
		console.log("this is the index " + index);
		var ind = parseInt(index);
		console.log(ind);
		console.log("chart height: " + $("#charty"+ ind).height());
		$("#charty" + ind ).css('max-height','none');
		$("#charty" +ind).css("height",$(id).height());
		$("#charty" +ind).css("width",$(id).width());
		console.log("chart height after : " + $("#charty" + ind ).height());
		if(optionHandler.array[index].classname == "tumbheat"){
			d3.select("#tumbheat" + index).remove();
			console.log("tumbheat" + optionHandler.array[index].container);
			heatmap(optionHandler.array[index]);
			return;
		}
		optionHandler.array[index].legend=false;
		optionHandler.array[index].tooltip = false;
		optionHandler.array[index].axis = false;
		optionHandler.array[index].interaction = false;
		optionHandler.array[index].tumb = true;
		optionHandler.array[index].matrix = copyMatrix(optionHandler.array[index].orgmatrix);
		var chart = optionHandler.array[index].chart(optionHandler.array[index]);
		optionHandler.array[index].c3 = chart;
	},
	resize : function(id){
		var index = id.split("tumb").slice(-1)[0]-1;
		optionHandler.array[index].c3.resize({height:$(id).height(), width:$(id).width()})
	},
	normalizeColumns : function(id){
		console.log(id);
		console.log("Normalizing columns");
		var index = id.split("charty").slice(-1)[0];
		if(optionHandler.array[index].swap){
			transformer.swapcategories(id);
		}
		if(optionHandler.array[index].norm){
			optionHandler.array[index].norm = false;
		}
		if(optionHandler.array[index].c3!=null){
						// optionHandler.array[index].c3.unload();
						// optionHandler.array[index].c3.load({columns : copyMatrix(normalizeByRow(optionHandler.array[index].matrix)}));
						if(optionHandler.array[index].norm2 == false){
							optionHandler.array[index].matrix = copyMatrix(normalizeColumns(optionHandler.array[index].orgmatrix));
							// optionHandler.array[index].matrix = addToSideHeader(optionHandler.array[index].matrix," i %")
							optionHandler.array[index].norm2 = true;
						}else if(optionHandler.array[index].norm2 = true){
							optionHandler.array[index].matrix = copyMatrix(optionHandler.array[index].orgmatrix);
							optionHandler.array[index].norm2 = false;
						}
						var chart = optionHandler.array[index].chart(optionHandler.array[index]);
						optionHandler.array[index].c3 = chart;
					}else{
						$(id + " svg").remove();
						if(optionHandler.array[index].norm2 == false){
							optionHandler.array[index].matrix = copyMatrix(normalizeColumns(optionHandler.array[index].orgmatrix));
							optionHandler.array[index].norm2 = true;
						}else if(optionHandler.array[index].norm2 = true){
							optionHandler.array[index].matrix = copyMatrix(optionHandler.array[index].orgmatrix);
							optionHandler.array[index].norm2 = false;
						}

						var newHeight = $("#tumb" + index).height() -  $(".titleText").height() -  $(".infoText").height() - $('#btnswap' + index).height() 
						-parseInt($('.titleText').css('margin-top'))
						-parseInt($('.infoText').css('margin-top'))
						-parseInt($('#btnswap' + index).css('padding-top'))
						-parseInt($('.titleText').css('margin-bottom'))
						-parseInt($('.infoText').css('margin-bottom'))
						-parseInt($('#btnswap' + index).css('padding-bottom'));

						heatmap2(optionHandler.array[index],newHeight);

					}
					if(optionHandler.array[index].norm2){
						$('.norm2').css('background-color','#D12A09');
					}else{
						$('.norm2').css('background-color','#8FC043');
					}
					if(optionHandler.array[index].norm){
						$('.norm').css('background-color','#D12A09');
					}else{
						$('.norm').css('background-color','#8FC043');
					}
				},
				normalizeRows : function(id){
					console.log(id);
					var index = id.split("charty").slice(-1)[0];
					if(optionHandler.array[index].swap){
						transformer.swapcategories(id);
					}
					if(optionHandler.array[index].norm2){
						normalizeColumns(id);
					}
					optionHandler.array[index].norm2 = false;
					if(optionHandler.array[index].c3!=null){
						// optionHandler.array[index].c3.unload();
						// optionHandler.array[index].c3.load({columns : copyMatrix(normalizeByRow(optionHandler.array[index].matrix)}));
						if(optionHandler.array[index].norm == false){
							optionHandler.array[index].matrix = copyMatrix(optionHandler.array[index].orgmatrix);
							optionHandler.array[index].matrix = normalizeByRow(optionHandler.array[index].matrix);
							optionHandler.array[index].matrix = addToSideHeader(optionHandler.array[index].matrix," i %")
							optionHandler.array[index].norm = true;
						}else if(optionHandler.array[index].norm = true){
							optionHandler.array[index].matrix = copyMatrix(optionHandler.array[index].orgmatrix);
							optionHandler.array[index].norm = false;
						}
						var chart = optionHandler.array[index].chart(optionHandler.array[index]);
						optionHandler.array[index].c3 = chart;
					}else{
						$(id + " svg").remove();
						if(optionHandler.array[index].norm == false){
							optionHandler.array[index].matrix = copyMatrix(optionHandler.array[index].orgmatrix);
							optionHandler.array[index].matrix = normalizeByRow(optionHandler.array[index].matrix);
							optionHandler.array[index].norm = true;
						}else if(optionHandler.array[index].norm = true){
							optionHandler.array[index].matrix = copyMatrix(optionHandler.array[index].orgmatrix);
							optionHandler.array[index].norm = false;
						}

						var newHeight = $("#tumb" + index).height() -  $(".titleText").height() -  $(".infoText").height() - $('#btnswap' + index).height() 
						-parseInt($('.titleText').css('margin-top'))
						-parseInt($('.infoText').css('margin-top'))
						-parseInt($('#btnswap' + index).css('padding-top'))
						-parseInt($('.titleText').css('margin-bottom'))
						-parseInt($('.infoText').css('margin-bottom'))
						-parseInt($('#btnswap' + index).css('padding-bottom'));

						heatmap2(optionHandler.array[index],newHeight);

					}
					if(optionHandler.array[index].norm){
						$('.norm').css('background-color','#D12A09');
					}else{
						$('.norm').css('background-color','#8FC043');
					}
					if(optionHandler.array[index].norm2){
						$('.norm2').css('background-color','#D12A09');
					}else{
						$('.norm2').css('background-color','#8FC043');
					}
				},
				normalizeMatrix : function(id){
					var index = id.split("btnnormM").slice(-1)[0];
					if(optionHandler.array[index].c3!=null){
						optionHandler.array[index].c3.unload();
						optionHandler.array[index].c3.load({columns : normalize(optionHandler.array[index].matrix,1)});
					}

				},
				swapcategories : function(id){
					var index = id.split("charty").slice(-1)[0];

					if(optionHandler.array[index].norm){
						transformer.normalizeRows(id);
					}
						if(optionHandler.array[index].norm2){
						transformer.normalizeColumns(id);
					}
					optionHandler.updateOption(index,"swap", !optionHandler.array[index].swap);
					if(optionHandler.array[index].c3!=null){
						// optionHandler.array[index].c3.unload();
						// optionHandler.array[index].c3.load({columns : normalizeByRow(optionHandler.array[index].matrix)});
						optionHandler.array[index].matrix = swapCategorical(optionHandler.array[index].matrix);

						var chart = optionHandler.array[index].chart(optionHandler.array[index]);
						optionHandler.array[index].c3 = chart;
					}else{
						$(id + " svg").remove();
						optionHandler.array[index].matrix = swapCategorical(optionHandler.array[index].matrix);

						var newHeight = $("#tumb" + index).width() -  $(".titleText").height() -  $(".infoText").height() - $('#btnswap' + index).height() 
						-parseInt($('.titleText').css('margin-top'))
						-parseInt($('.infoText').css('margin-top'))
						-parseInt($('#btnswap' + index).css('padding-top'))
						-parseInt($('.titleText').css('margin-bottom'))
						-parseInt($('.infoText').css('margin-bottom'))
						-parseInt($('#btnswap' + index).css('padding-bottom'));
						console.log("MY NEW HEIGHT -->" + newHeight);
						heatmap2(optionHandler.array[index], newHeight);
					}


					if(optionHandler.array[index].swap){
						$('.swap').css('background-color','#D12A09');
					}else{
						$('.swap').css('background-color','#8FC043');
					}
				},
				setTransButtons : function(options,index){
					console.log(options);
					$("#tumb" + index).prepend(transformer.getShareButton(index));
					$("#btnshare" + index).on('click', function(event) {
						alert(errorMessages.share);
					});;
					if(options.questions.length == 1){
						console.log("ONE QUESTION");
						if(functionName(options.chart)=="bar"){
							// var swap= transformer.getSwapButton(index);
							// $("#tumb" + index).prepend(swap);
							transformer.appendSwapButton(index);
					// $(swap).insertBefore($("#charty" + (options.id + 1)));
				}
				return;
			}
			else if(options.questions.length == 2){
				console.log("TWO QUESTIONS");
				var q1 = options.questions[0];
				var q2 = options.questions[1];
				console.log(q1 + "---" + q2);
			// One is slider one is pick_n
			if(q1 != q2){
				// var swap= getSwapButton(index);
				// $("#tumb" + index).append(swap);
				transformer.appendSwapButton(index);

			}else if(q1 == "pick_n" && q2 == "pick_n"){
				console.log("TO PICK N");
				var isNormalized = "Normalize first";
				// var norm= $('<input type="button" value="'+ isNormalized +'" id="btnnorm'+index+'" class="norm"/>');
				// $(norm).insertBefore($("#charty" + (options.id + 1)));
				// $("#tumb" + index).prepend(norm);
				transformer.appendNormButton(index);
				transformer.appendNorm2Button(index);
				// var swap= $('<input type="button" value="swap" id="btnswap'+index+'" class="swap"/>');
				// $(swap).insertBefore($("#charty"+ (options.id + 1)));
					// $("#tumb" + index).prepend(swap);
					transformer.appendSwapButton(index);
				}
			}

		},
		getSwapButton : function(index){
			return	$('<input type="button" value="'+buttons.swap+'" id="btnswap'+index+'" class="swap"/>');
		},
		getNormButton : function(index){
			return 	$('<input type="button" value="'+ buttons.normalize +'" id="btnnorm'+index+'" class="norm"/>');
		},
		getNormButton2 : function(index){
			return 	$('<input type="button" value="'+ buttons.normalize2 +'" id="btnnorm2'+index+'" class="norm2"/>');
		},
		getShareButton : function(index){
			return 	$('<input type="button" value="'+ buttons.share +'" id="btnshare'+index+'" class="share"  style="background-color : #88CBC4"/>');
		},
		appendSwapButton : function(index){
			var swap = transformer.getSwapButton(index);
			$("#tumb" + index).prepend(swap);
			$("#btnswap"+index).on('click', function(event) {
				
				console.log(event);
				console.log("****SWAP***");
				var i = event.currentTarget.id.split("btnswap").slice(-1)[0];
				// $("#btnswap"+index).prop("value" ,"unnormalize first");
				// i++;
				transformer.swapcategories("#charty" + i);
			});
		},
		appendNormButton : function(index){
			var norm = transformer.getNormButton(index);
			$("#tumb" + index).prepend(norm);
			$("#btnnorm" + index).on('click',function(event) {
				console.log("****norm*****");
				var i = event.currentTarget.id.split("btnnorm").slice(-1)[0];
				console.log(event);
				// i++;
				transformer.normalizeRows("#charty" + i);
			});
		},
		appendNorm2Button : function (index){
			var norm2 = transformer.getNormButton2(index);
			$("#tumb" + index).prepend(norm2);
			$("#btnnorm2" + index).on('click',function(event) {
				console.log("****norm*****");
				var i = event.currentTarget.id.split("btnnorm2").slice(-1)[0];
				console.log(event);
				// i++;
				transformer.normalizeColumns("#charty" + i);
			});
		}
	}