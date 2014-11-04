// Fill table with data
// CSS for this page blatantly stolen from: http://red-team-design.com/css3-ordered-list-styles/
function populateTable() {
	// Empty content string
	var tableContent = '';

	// jQuery AJAX call for JSON
	$.getJSON( '/pollroute/exportpolljsonclean/'+window.location.href.split('/').pop(), function( data ) {
		// Inject the whole content string into our existing HTML table
		if(data.msg === null) {
			alert('Network error!');
		} else {
			$('#pollTitle').text(data.name);
			$('#pollMetadata').hide();

			// For each question
			for(var questionCounter in data.question_list) {
				console.log('question: '+questionCounter);

				// Construct a collapsible set
				$('#collapsibleSet').append('<div data-role="collapsible" id="collapsible-'+questionCounter+'"></div>');

				// Inside the collapsible, add a grid
				$('#collapsible-'+questionCounter).append('<div class="ui-grid-a" id="grid-'+questionCounter+'"></div>');

				// Inside the grid, add a div for the question list and a div for the graph
				$('#grid-'+questionCounter).append('<div class="ui-block-a" style="padding: 15px;" id=collapsibleDiv-'+questionCounter+'></div>');
				$('#grid-'+questionCounter).append('<div class="ui-block-b" style="padding: 0px;" id=collapsibleGraph-'+questionCounter+'></div>');
				//$('#collapsibleGraph-'+questionCounter).append('<p style="text-shadow: none;">Put a graph here!</p>');
				$('#collapsible-'+questionCounter).append($('<h4></h4>').text(data.question_list[questionCounter].body));
				$('#collapsibleDiv-'+questionCounter).append($('<ol class="rounded-list"></ol>'));

				// Then, inside the collapsible,
				// For each response
				// Add the response to an ordered list
				for(var responseCounter in data.question_list[questionCounter].type.response_list) {
					if(data.question_list[questionCounter].type.name !== 'slider') {
						console.log('response: '+responseCounter + ' is ' + JSON.stringify(data.question_list[questionCounter].type.response_list[responseCounter].body));
						var tempResponse = $('<li><a href="">'+data.question_list[questionCounter].type.response_list[responseCounter].body+'</a></li>');//.text("LOL");
						//tempResponse.append($('<a href=""></a>')).text(data.question_list[questionCounter].type.response_list[responseCounter].body);
						$('#collapsibleDiv-'+questionCounter+' ol').append(tempResponse);
					} else {
						$('#collapsibleDiv-'+questionCounter).remove();
					}
				}

				// Render the graph if it's not a slider or not_a_question
				console.log('Loading from: '+window.location.origin+'/pollroute/frequency'+window.location.pathname.split('/polloverview')[1]+'/'+questionCounter);
				if(data.question_list[questionCounter].type.name === 'slider') {
					$('#collapsibleGraph-'+questionCounter).append('<p style="text-shadow: none;">This question was a slider, and is not being visualized yet.</p>');
				} else if (data.question_list[questionCounter].type.name === 'not_a_question') {
					$('#collapsibleGraph-'+questionCounter).append('<p style="text-shadow: none;">This prompt could not be responded to.</p>');
				} else {


					//(url, container, questionNumber, type of graph)
					maggio.visualizeChart(window.location.origin+'/pollroute/exportpolljson'+window.location.pathname.split('polloverview')[1], '#collapsibleGraph-'+questionCounter, [(parseInt(questionCounter)+1).toString()], ['bar']);
					//loadMatrixCSV(window.location.origin+"/pollroute/frequency"+window.location.pathname.split('/polloverview')[1]+"/"+questionCounter,"#collapsibleGraph-"+questionCounter);




				}
				//$("#collapsibleDiv-"+questionCounter).height( $("#collapsibleGraph-"+questionCounter).height() );
			}
			$('#collapsibleSet').trigger('create');
		}
	});
}

// DOM Ready =============================================================
$(document).ready(function() {
	// Populate the user table on initial page load
	populateTable();
	//$(document).ready(function(){
	//$("#side").height( $("#main").height() );
	//});
});

//function appendText() {
//    var txt1 = "<p>Text.</p>";              // Create text with HTML
//    var txt2 = $("<p></p>").text("Text.");  // Create text with jQuery
//    var txt3 = document.createElement("p");
//    txt3.innerHTML = "Text.";               // Create text with DOM
//    $("body").append(txt1, txt2, txt3);     // Append new elements
//}