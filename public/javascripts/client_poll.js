var current_question = 0;

//eval(alert($('#data')[0].innerHTML)); // jshint ignore:line
eval($('#data')[0].innerHTML); // jshint ignore:line

renderCurrentQuestion(0);
renderBottomButtons();

/*for (entry in Object.keys(poll.question_list)) {
	if(poll[String(entry)] !== undefined) {
		alert(entry+': '+poll[entry]);
	}
}*/

//$('#question p').text('This poll has the hash: '+ poll._id);

function tableOfQuestions()
{
	var tableContent = '';
	for (var entry in poll.question_list) {
	//	alert(entry);
	//	alert(poll['question_list']['body'])

	//	if(poll.question_list[String(entry)] !== undefined) {
	//		alert(entry+': '+poll.question_list[entry]);
	//	}

		tableContent += '<tr>';
		tableContent += '<td>' + String(entry) + '</td>';
		tableContent += '<td>' + poll.question_list[entry].body + '</td>';
		tableContent += '<td>' + poll.question_list[entry]['type'].name + '</td>';
		tableContent += '</tr>';
	}
	$('#question table tbody').html(tableContent);
}




//temp += '<form><label><input type = "checkbox" name="checkbox-0">Check me.</label></form>'

/*$('#createButton').bind('click', function() {
    $('#buttonPlaceHolder').append('<a href="#" data-role="button">'+$('#buttonText').val()+'</a>');

    // refresh jQM controls
    $('#home').trigger('create');
});*/

function demoButtons(){
	var temp = ''
	temp += '<fieldset data-role="controlgroup">'
	temp += '<legend>Vertical:</legend>'
	temp += '<input type="radio" name="radio-choice-v-2" id="radio-choice-v-2a" value="on" checked="checked">'
	temp += '<label for="radio-choice-v-2a">One</label>'
	temp += '<input type="radio" name="radio-choice-v-2" id="radio-choice-v-2b" value="off">'
	temp += '<label for="radio-choice-v-2b">Two</label>'
	temp += '<input type="radio" name="radio-choice-v-2" id="radio-choice-v-2c" value="other">'
	temp += '<label for="radio-choice-v-2c">Three</label>'
	temp += '</fieldset>'
	temp += '</form>'
	$('#form').html(temp);
	$('#form').trigger('create');
}


//THESE THREE FUNCTIONS NEED:
	//INPUT VALIDATION
	//ANSWER LOGGING
	//AWARENESS OF THE 'end of the line'
	//AWARENESS OF THE 'beginning of the line'
function nextQuestion()
{
	current_question += 1;
	$('#lastquestion').removeClass( 'ui-state-disabled' );
	if(current_question >= poll.question_list.length-1)
	{
		//2 vs 3 => true
		$('#nextquestion').addClass('ui-state-disabled');
		$('#skipquestion').addClass('ui-state-disabled');
	}
	renderCurrentQuestion(current_question);
}

function lastQuestion()
{
	current_question -= 1;
	$('#nextquestion').removeClass( 'ui-state-disabled' );
	$('#skipquestion').removeClass('ui-state-disabled');
	if(current_question <= 0)
	{
		$('#lastquestion').addClass( 'ui-state-disabled' );
	}
	renderCurrentQuestion(current_question);
}

function skipQuestion()
{
	current_question += 1;
	$('#lastquestion').removeClass( 'ui-state-disabled' );
	if(current_question >= poll.question_list.length-1)
	{
		//2 vs 3 => true
		$('#nextquestion').addClass('ui-state-disabled');
		$('#skipquestion').addClass('ui-state-disabled');
	}
	renderCurrentQuestion(current_question);
}

function renderCurrentQuestion(qtr)
{
	var temp = ''
	current_question = qtr

	//alert(poll.question_list[current_question].body)

	$('#lead p').html(poll.question_list[current_question].body);
	if (poll.question_list[current_question].type.name === "pick_n") {
		// For each answer, draw a button
		temp += '<fieldset data-role="controlgroup">'
		var counter = 0;
		for (entry in poll.question_list[current_question].type.response_list) {
			// Create a button to click!
			// If N > 1, use check boxes, else use radio buttons
			if (poll.question_list[current_question].type.n === 1)
			{

				//MISSING OPEN FORM!!!

				// Draw radio buttons
				//alert(poll.question_list[current_question].type.response_list[entry].body);
				temp += '<input type="radio" name="radio-choice-'+
						counter+'" id="radio-choice-'+counter+'" value="on">'
				temp += '<label for="radio-choice-'+counter+'">'+
						String(poll.question_list[current_question].type.response_list[entry].body)+'</label>'
			} else {
				// Draw check boxes
				temp += '<input type="checkbox" name="checkbox-'+
						counter+'" id="checkbox-'+counter+'">'
        		temp += '<label for="checkbox-'+counter+'">'+
        				String(poll.question_list[current_question].type.response_list[entry].body)+'</label>'
			}
				// It should update entry.answers <---this happens in DOM ready
				// It should check entry.*_explainable when rendering
				counter += 1;
		}
	}
		if (poll.question_list[current_question].type.name === "slider") {
			//alert('min: '+ String(poll.question_list[current_question].type.min))
			//alert('max: '+ String(poll.question_list[current_question].type.max))
			// Draw slider
			// TERRIBLE AWFUL DIRTY HACK: ASSUMED THAT STARTING POSITION = MIN + MAX / 2

			temp += '<form class="full-width-slider">'
			temp += '<input type="range" name="slider-1" id="slider-1"'
			temp += 'min="'+String(poll.question_list[current_question].type.min)+'"'
			temp += 'max="'+String(poll.question_list[current_question].type.max)+'"'
			temp += 'value="'+String((poll.question_list[current_question].type.max - poll.question_list[current_question].type.min + 1)/2)+'"'
			temp += 'step="'+String(poll.question_list[current_question].type.step)+'"'
			temp += 'data-popup-enabled="true">'
		}


		temp += '</fieldset>'
		temp += '</form>'
		$('#form').html(temp);
		$('#form').trigger('create');

}

function renderBottomButtons()
{
	// Render 'back' and 'next' buttons
	var temp = ''
	temp += '<div data-role="controlgroup" data-type="horizontal" text-align="center" margin-left="auto" margin-right="auto" align="center">'
	temp += '<a href="#" class="lastquestion ui-state-disabled" id="lastquestion" data-role="button" data-icon="carat-l" data-iconpos="left">Back</a>'
	// Check to see if you should render a 'skip' button
	temp += '<a href="#" class="skipquestion" id="skipquestion" data-role="button">Skip</a>'
	temp += '<a href="#" class="nextquestion" id="nextquestion" data-role="button" data-icon="carat-r" data-iconpos="right">Next</a>'
	$('#bottombuttons').html(temp);
	//$('#lastquestion').button();
	$('#bottombuttons').trigger('create');
}

// DOM Ready =============================================================
$(document).ready(function() {

	// Populate the user table on initial page load
	renderCurrentQuestion(current_question);

	// Username link click
	//$('#listpoll table tbody').on('click', 'td a.linkshowuser', showUserInfo);

	// Add User button click
	// $('#btnAddUser').on('click', addUser);

	// Delete Poll link click
    //$('#listpoll table tbody').on('click', 'td a.linkdeletepoll', deletePoll);
    $('#bottombuttons div div').on('click', 'a.nextquestion', nextQuestion);
    $('#bottombuttons div div').on('click', 'a.lastquestion', lastQuestion);
    $('#bottombuttons div div').on('click', 'a.skipquestion', skipQuestion);

});