var visframes = {
	container : null,
	basicFrame : function(topclass,topid,chartclass,chartid){

		return outer.append(inner);
	},
	addBasic: function(container,topclass,topid,chartclass,chartid){
			var outer ="<div class='"+topclass+"' id='"+topid+"'></div>";
			var inner ="<div class='"+chartclass+"'' id='"+chartid+"'></div>";

			$(container).append(outer);
			$("#"+topid).append(inner);
			// $(container).append(visframes.basicFrame(topclass,topid,chartclass,chartid));
			

	}
}
