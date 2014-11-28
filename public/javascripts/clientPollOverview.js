if(window.localStorage.recent !== undefined && window.localStorage.recent !== 'undefined') {
	var poll = JSON.parse(window.localStorage.recent);
} else {
	poll = undefined;
}

var topData;
// Fill table with data
// CSS for this page blatantly stolen from: http://red-team-design.com/css3-ordered-list-styles/
function populateTable(callback) {
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
			topData = data;
			// For each question
			for(var questionCounter in data.question_list) {
				console.log('question: '+questionCounter);

				// Construct a collapsible set
				$('#collapsibleSet').append('<div data-role="collapsible" id="collapsible-'+questionCounter+'"></div>');

				// Inside the collapsible, add a grid
				$('#collapsible-'+questionCounter).append('<div class="ui-grid-a" id="grid-'+questionCounter+'"></div>');
				//$('#collapsible-'+questionCounter).append('<div id="grid-'+questionCounter+'"></div>');

				// Inside the grid, add a div for the question list and a div for the graph
				$('#grid-'+questionCounter).append('<div class="ui-block-a" style="height:65vh;padding: 15px;" id=collapsibleDiv-'+questionCounter+'></div>');
				$('#grid-'+questionCounter).append('<div class="ui-block-b" style="height:65vh;padding: 0px;" id=collapsibleGraph-'+questionCounter+'></div>');
				//$('#grid-'+questionCounter).append('<div style="padding: 15px; width: 400px !important; height:75vh" id=collapsibleDiv-'+questionCounter+'></div>');
				//$('#grid-'+questionCounter).append('<div style="padding: 0px; width: 400px !important; height:75vh" id=collapsibleGraph-'+questionCounter+'></div>');
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
						$('#collapsibleGraph-'+questionCounter).width('100%');
					}
				}

				// If the question is not a slider or not_a_question
				if(data.question_list[questionCounter].type.name === 'slider' || data.question_list[questionCounter].type.name === 'pick_n') {
					//$('#collapsibleGraph-'+questionCounter).append('<p style="text-shadow: none;">This question was a slider, and is not being visualized yet.</p>');
				} else if (data.question_list[questionCounter].type.name === 'not_a_question') {
					$('#collapsibleDiv-'+questionCounter).remove();
					if(data.language && data.language === 'english') {
						$('#collapsibleGraph-'+questionCounter).append('<p style="text-shadow: none;">This question type isn\'t visualizable. Sorry!</p>');
					} else {
						$('#collapsibleGraph-'+questionCounter).append('<p style="text-shadow: none;">Denna fråga kan ej visualiseras.</p>');
					}
					$('#collapsibleGraph-'+questionCounter).height('54px');
				} else { //open questions
					$('#collapsibleDiv-'+questionCounter).remove();
					if(data.language && data.language === 'english') {
						$('#collapsibleGraph-'+questionCounter).append('<p style="text-shadow: none;">This question type isn\'t visualizable yet. Sorry!</p>');
					} else {
						$('#collapsibleGraph-'+questionCounter).append('<p style="text-shadow: none;">Denna fråga kan ej visualiseras än.</p>');
					}
					$('#collapsibleGraph-'+questionCounter).height('54px');
				}
			}
			$('#collapsibleSet').trigger('create');
		}
		callback(data);
	});
}

function stripPunctuationAndHyphenate(string) {
	return string.replace(/[\.,\\/#!$%\^&\*;:{}=_`~()]/g,'').replace(/\s{2,}/g,'-');
}

// DOM Ready =============================================================
$(document).ready(function() {
	// Populate the user table on initial page load
	populateTable(function(data) {
		//$('#collapsibleSet').trigger('create');
		$('.ui-collapsible-heading').on('click', function() {
			var questionCounter = this.parentNode.id.split('-').pop();
			if(!$('#collapsibleGraph-'+questionCounter+' svg')[0]) {
				var answers = [];
				try {
					if (poll && (poll.id === data.id)) {
						for (var responseCounter in poll.question_list[questionCounter].type.response_list) {
							if(poll.question_list[questionCounter].type.response_list[responseCounter].answers[0].value) {
								answers.push(poll.question_list[questionCounter].type.response_list[responseCounter].body);
								//poll.question_list[questionCounter].type.response_list[responseCounter].body
								//$('#collapsibleGraph-'+questionCounter+' *').find('target-'stripPunctuationAndHyphenate(poll.question_list[questionCounter].type.response_list[responseCounter].body))
								//$('#collapsibleGraph-'+questionCounter).find('.c3-chart-bar.c3-target-'+stripPunctuationAndHyphenate(poll.question_list[questionCounter].type.response_list[responseCounter].body)+'-').children().children().css('stroke', '#EE474D')
							}
						}
					}

					console.log('ANSWERS---------------------v');
					console.log(answers);
					console.log('ANSWERS---------------------^');
					if(data.question_list[questionCounter].type.name === 'slider') {
						maggio.visualizeChart(
							window.location.origin+'/pollroute/exportpolljson'+window.location.pathname.split('polloverview')[1],
							'#collapsibleGraph-'+questionCounter,
							[(parseInt(questionCounter)).toString()],
							['histogram'], answers[0]);
					} else if (data.question_list[questionCounter].type.name === 'pick_n') {
						maggio.visualizeChart(
							window.location.origin+'/pollroute/exportpolljson'+window.location.pathname.split('polloverview')[1],
							'#collapsibleGraph-'+questionCounter,
							[(parseInt(questionCounter)).toString()],
							['bar'], answers[0]);
					}

				} catch(err) {
					console.warn(err);
				}
			}
		});
	});
});