var current_question;
var value = Math.floor((Math.random() * 1000000)+1);
var user_token = ('00000000' + value).slice(-8);



//eval(alert($('#data')[0].innerHTML)); // jshint ignore:line
eval($('#data')[0].innerHTML); // jshint ignore:line


//WARN: This is not in use right now; it ASSUMES that you support HTML5 storage!
function supports_html5_storage() {
	try {
		return 'localStorage' in window && 'sessionStorage' in window && window['sessionStorage'] !== null && window['localStorage'] !== null;
	} catch (e) {
		return false;
	}
}

function store_poll() {
	if (supports_html5_storage()) {
		window.localStorage['poll'+poll._id] = JSON.stringify(poll);
		window.localStorage['current'+poll._id] = JSON.stringify(current_question);
	} else {
		//UNTESTED: fall back on window.namespace clobbering
		window['polljspoll'+poll._id] = poll;
		window['polljscurrent'+poll._id] = current_question;
	}
}

function clean_poll(callback) {
	console.log('Cleaning poll.');
	for (question in poll.question_list) {
		for (response in poll.question_list[question].type.response_list) {
			try {
				if(typeof poll.question_list[question].type.response_list !== 'undefined' && typeof poll.question_list[question].type.response_list[response].answers !== 'undefined' && typeof poll.question_list[question].type.response_list[response].explanation !== 'undefined' && typeof poll.question_list[question].type.response_list[response].answers[0] !== 'undefined' && poll.question_list[question].type.response_list[response].answers[0][1] !== true) {
					console.log('Question '+question+' had response '+response+' with the value of '+poll.question_list[question].type.response_list[response].answers[0]+'. Cleared.' )
					poll.question_list[question].type.response_list[response].answers = [[undefined, undefined, undefined]]
				}
			} catch (err) {
				console.log(err+' '+question+' '+response);
				console.log(poll);
			}

		}
	}
	callback();
}

function submitPoll() {
	clean_poll( function () {
		$.ajax({
		type: 'POST',
		data: poll,
		url: '/pollroute/answerpoll',
		dataType: 'JSON'
	}).done(function(response){
		// Delete local storage of results
		// STUB: Lock this user out of this poll in the future, server-side
		// Check for successful (blank) response
		if (response.msg === '') {
			window.onbeforeunload = function() {}
			clear_storage();
			poll = undefined;
		} else {
			// If something went wrong, alert the error message
			alert('Error: '+response.msg);
		}
	})

})
}

function load_poll() {
	if(supports_html5_storage()) {
		poll = JSON.parse(window.localStorage['poll'+window.location.pathname.split('poll/').slice(-1)]);
		current_question = parseInt(window.localStorage['current'+window.location.pathname.split('poll/').slice(-1)]);
	} else {
		//UNTESTED: load from window.namespace
		poll = window['polljspoll'+poll._id];
		current_question = window['polljscurrent'+poll._id];
	}
}

function poll_is_stored() {
	if(supports_html5_storage()) {
		return typeof window.localStorage["poll"+poll._id] !== 'undefined';
	} else {
		//UNTESTED: return window.namespace's existance
		return (typeof window['polljspoll'+poll._id] !== 'undefined'
			&& typeof window['polljscurrent'+poll._id] !== 'undefined');
	}
}


/**
 *	Returns HTML string, temp, to be appended to the HTML string in its caller.
 *	This appending is the caller's responsibility. Called by render_pick_n() for every question.
 *	This function is safe to call when unnecessary;
 *	The actual injection, rendering, and inflation occurs in renderCurrentQuestion(), after render_pick_n() returns.
 *	@param {int} counter - The number of the response the text field might be rendered for. Not to be confused with current_question!
 *	@returns {string} temp - The HTML string describing the text field. Caller must append to its own HTML string.
 */
function render_text_field(counter) {
	// Renders a text field IFF it's needed. Safe to call when a text field is unnecessary.
	temp = '';
	var current_response = poll.question_list[current_question].type.response_list[counter];
	if(typeof current_response !== 'undefined' && typeof current_response['explanation'] !== 'undefined' /*&& $('#text-'+String(counter)).length === 0*/ ) {
		// WARN: ONLY PICK-N WILL CONDITIONALLY WORK
		// BECAUSE OF PICK-CHOICE+i
		// STUB: COLUMNS AND ROWS NOT MUTABLE
		// STUB: data-clear-btn="true" DOES NOT WORK WITH TEXTAREAS
		if ( current_response.explanation.always_explainable || ($('#pick-choice-'+String(counter)).is(':checked')) ) {
			if ( typeof current_response.explanation['label'] !== 'undefined' ) {
				temp += '<label for="text-'+counter+'">'+current_response.explanation['label']+'</label>';
			} else {
				temp += '<label for="text-'+counter+'" class="ui-hidden-accessible"></label>';
			}
			if ( typeof current_response.explanation['explain_text'] !== 'undefined' ) {
				temp += '<textarea cols="40" rows="8" type="text" name="text-'+counter+'" id="text-'+counter+'" value="" placeholder="'+current_response.explanation['explain_text']+'"></textarea>'
			} else {
				temp += '<textarea cols="40" rows="8" type="text" name="text-'+counter+'" id="text-'+counter+'" value=""></textarea>'
			}
		}
	}
	return temp;
}

/**
 *	Appends HTML to the string temp corresponding to this question's pick_n field.
 *	The actual injection, rendering, and inflation occurs in renderCurrentQuestion().
 *	Called in renderCurrentQuestion().
 *	@param {string} temp - The HTML string that is passed in.
 *	@returns {string} temp - The HTML string that was passed in, after more HTML is appended to it.
 */
function render_pick_n(temp) {
	// For each answer, draw a button
	temp += '<fieldset data-role="controlgroup">';

	//var counter = 0;
	for (var entry in poll.question_list[current_question].type.response_list) {
		// Create a button to click!
		// If N > 1, use check boxes, else use radio buttons
		if (poll.question_list[current_question].type.n === 1) {

			//MISSING OPEN FORM!!!

			// Draw radio buttons
			temp += '<input type="radio" name="pick-choice" id="pick-choice-'+entry+'" value="off">';
			temp += '<label for="pick-choice-'+entry+'">'+
					String(poll.question_list[current_question].type.response_list[entry].body)+'</label>';
		} else {
			// Draw check boxes
			temp += '<input type="checkbox" name="checkbox" id="pick-choice-'+entry+'">';
			temp += '<label for="pick-choice-'+entry+'">'+
					String(poll.question_list[current_question].type.response_list[entry].body)+'</label>';
		}
			// Append any relevant text fields
			temp += render_text_field(entry);
	}
	return temp
}

/**
 *	Appends HTML to the string temp corresponding to this question's slider.
 *	The actual injection, rendering, and inflation occurs in renderCurrentQuestion().
 *	Called in renderCurrentQuestion().
 *	@param {string} temp - The HTML string that is passed in.
 *	@returns {string} temp - The HTML string that is passed in, after being appended to.
 */
function render_slider(temp) {
	// Append slider for drawing in renderCurrentQuestion
	// WARN: TERRIBLE AWFUL DIRTY HACK: ASSUMED THAT STARTING POSITION = MIN + MAX / 2
	temp += '<form class="full-width-slider">';
	temp += '<input type="range" name="slider" id="slider"';
	temp += 'min="'+String(poll.question_list[current_question].type.min)+'"';
	temp += 'max="'+String(poll.question_list[current_question].type.max)+'"';
	temp += 'value="'+String((poll.question_list[current_question].type.max - poll.question_list[current_question].type.min + 1)/2)+'"';
	temp += 'step="'+String(poll.question_list[current_question].type.step)+'"';
	temp += 'data-popup-enabled="true">';
	return temp;
}

/**
 *	Creates and updates text fields.
 *	Conditionally either creates a text field, updates a text field with local poll's data, sets a text field to blank, or deletes a text field.
 *	The poll is not modified at all in this function.
 *	Called on ui-radio-btn.change(), nextQuestion(), lastQuestion(), and renderCurrentQuestion().
 *	Curiosly enough, it is NOT called in skipQuestion(). This is an oversight.
 *	// WARN: This function is almost certainly being called more often than necessary.
 */
function update_text_field() {
	var temp;
	// If it's not_a_question, or otherwise has no responses, do no work
	if(typeof poll.question_list[current_question].type.response_list === 'undefined') {
		return;
	}

	for (var counter in poll.question_list[current_question].type.response_list) {
		temp = '';
		//WARN: Use current_response to simplify code below!!!
		var current_response = poll.question_list[current_question].type.response_list[counter];
		if(typeof current_response !== 'undefined' && typeof current_response['explanation'] !== 'undefined') {
			// WARN: ONLY PICK-N WILL CONDITIONALLY WORK
			// BECAUSE OF PICK-CHOICE+i
			// STUB: COLUMNS AND ROWS NOT MUTABLE

			// If the question is (always explainable AND does not exist) OR (it is checked AND the text field does not exist)
			if ( (current_response.explanation.always_explainable && document.getElementById('text-'+String(counter)) === null && $('#text-'+String(counter)).length === 0)  ||
				($('#pick-choice-'+String(counter)).is(':checked')
				&& document.getElementById('text-'+String(counter)) === null && $('#text-'+String(counter)).length === 0 )) {
				// Then create the damn thing
				console.log(document.getElementById('text-'+String(counter)))
				console.log('We fully created text area #:'+counter)
				if ( typeof current_response.explanation['label'] !== 'undefined' ) {
					temp += '<label for="text-'+counter+'">'+current_response.explanation['label']+'</label>';
				} else {
					temp += '<label for="text-'+counter+'" class="ui-hidden-accessible"></label>';
				}
				if ( typeof current_response.explanation['explain_text'] !== 'undefined' && (typeof current_response.answers === 'undefined' || typeof current_response.answers[0] === 'undefined' || typeof current_response.answers[0][2] === 'undefined')) {
					temp += '<textarea cols="40" rows="8" type="text" name="text-'+counter+'" id="text-'+counter+'" value="" placeholder="'+current_response.explanation['explain_text']+'"></textarea>'
				} else if(typeof current_response.answers !== 'undefined' && typeof current_response.answers[0] !== 'undefined' & typeof current_response.answers[0][2] !== 'undefined') {
					temp += '<textarea cols="40" rows="8" type="text" name="text-'+counter+'" id="text-'+counter+'" value="">'+current_response.answers[0][2]+'</textarea>'
				} else {
					temp += '<textarea cols="40" rows="8" type="text" name="text-'+counter+'" id="text-'+counter+'" value=""></textarea>'
				}
				// WARN: This code happens n times for n text fields; maybe expensive
				if(poll.question_list[current_question].type.name === 'pick_n') {
					$('#pick-choice-'+String(counter)).parent().after(temp);	
				} else if (poll.question_list[current_question].type.name === 'slider') {
					$('#slider').parent().after(temp);	
				} else {
					console.log('UNEXPECTED CASE!');
					console.log(poll.question_list[current_question].type);
				}
				
				$('#form').trigger('create');
				$('.ui-radio').off('click', update_text_field);
				$('.ui-radio').on('click', update_text_field);

			// If the textfield exists, the explanation stored in local poll is defined, and it is checked
			} else if ( $('#text-'+String(counter)) !== 'undefined'
				&& typeof current_response.answers !== 'undefined'
				&& current_response.answers[0] !== null
				&& typeof current_response.answers[0] !== 'undefined'
				&& typeof current_response.answers[0][2] !== 'undefined'
				&& $('#pick-choice-'+String(counter)).is(':checked') ) {
					// Then render that explanation text in it.
					$('#text-'+String(counter)).val(current_response.answers[0][2]);

			// Else, if it is not checked, the explanation stored in local poll is undefined, and it is always renderable
			} else if ( $('#text-'+String(counter)) !== 'undefined'
				&& typeof current_response.answers !== 'undefined'
				&& current_response.answers[0] !== null
				&& typeof current_response.answers[0] !== 'undefined'
				&& typeof current_response.answers[0][2] !== 'undefined'
				&& !$('#pick-choice-'+String(counter)).is(':checked')
				&& current_response.explanation.always_explainable) {
					// Then render nothing in the textbox (allowing the hint to show through)
					$('#text-'+String(counter)).val('');

			// Else, if it is not checked, the explanation stored in local poll is undefined, and it is not always renderable
			} else if ( !current_response.explanation.always_explainable
				&& typeof $(this) !== 'undefined'
				&& $(this).attr("id") !== 'pick-choice-'+String(counter) && !$('#pick-choice-'+String(counter)).is(':checked')) {
				// Then delete the textbox
				$('#text-'+String(counter)).remove();
			}
		}
	}
}

/**
 *	Renders the current question by calling appropriate helper functions.
 *	Conditionally calls either render_pick_n() or render_slider() to generate HTML.
 *	HTML is then injected inside the #form div and inflated.
 *	Then, calls modify_current_question() and update_text_field().
 *	Called on DOM.ready(), nextQuestion(), lastQuestion(), and skipQuestion().
 */
function renderCurrentQuestion() {
	var temp = '';

	$('#lead p').html(poll.question_list[current_question].body);

	if (poll.question_list[current_question].type.name === 'pick_n') {
		temp += temp.concat(render_pick_n(temp));
	}
	else if (poll.question_list[current_question].type.name === 'slider') {
		temp += temp.concat(render_slider(temp));
	}

	temp += '</fieldset>';
	temp += '</form>';
	temp = '<form>'.concat(temp);
	$('#form').html(temp);
	$('#form').trigger('create');

	modify_current_question();
	update_text_field();
}

/**
 *	Sets check boxes, radio buttons, and sliders to the values stored in the local poll object.
 *	Called at the end of renderCurrentQuestion, and nowhere else.
 */
function modify_current_question() {
	for (var counter in poll.question_list[current_question].type.response_list) {
		if (poll.question_list[current_question].type.name === "pick_n") {
			if( typeof poll.question_list[current_question].type.response_list[counter] !== 'undefined' && typeof poll.question_list[current_question].type.response_list[counter].answers !== 'undefined' && poll.question_list[current_question].type.response_list[counter].answers[0] !== null && typeof poll.question_list[current_question].type.response_list[counter].answers[0] !== 'undefined' && poll.question_list[current_question].type.response_list[counter].answers[0][1] !== null && typeof poll.question_list[current_question].type.response_list[counter].answers[0][1] !== 'undefined') {
				$('#pick-choice-'+String(counter)).checkboxradio();
				$('#pick-choice-'+String(counter)).prop('checked', value);
				$("#pick-choice-"+String(counter)).checkboxradio("refresh");
			} else {
				// WARN: ?! what was supposed to be here?!
			}
		} else if (poll.question_list[current_question].type.name === "slider") {
			if( typeof poll.question_list[current_question].type.response_list[0] !== 'undefined' && typeof poll.question_list[current_question].type.response_list[counter].answers !== 'undefined' && typeof poll.question_list[current_question].type.response_list[0].answers[0] !== 'undefined') {
				$("#slider").val(poll.question_list[current_question].type.response_list[0].answers[0][1]);
				$( "#slider" ).slider("refresh");
			}
		}
	}
}


function validateCurrentQuestion(forward) {
	var counter = 0;
	// STUB: Generalize to an array to support checkbox explanations...
	var n_special = 0;
	// If we're doing a pick_n
//	console.log('Validating current question.');
	if (poll.question_list[current_question].type.name === 'pick_n') {
//		console.log('Validating pick_n question.');
		for (i = 0; i < poll.question_list[current_question].type.response_list.length; i += 1) {
			if($('#pick-choice-'+String(i)).is(':checked')) {
				counter += 1;
				n_special = i;
			}
		}
//		console.log(counter+' checked answers found. The last one is '+n_special+'.');
		// If we're picking 1 from a list
		if (poll.question_list[current_question].type.n === 1) {
//			console.log('Validating pick_1 question.');
			// And we have picked 1, and (explanation not required OR explanation provided)
			if(counter === 1 &&
				poll.question_list[current_question].type.response_list[n_special].explanation &&
				!poll.question_list[current_question].type.response_list[n_special].explanation.required ||
				$('#text-'+String(n_special)).val() !== "") {
				// Then we're valid
				return true;
			// Otherwise, we're invalid, and let's find out how
			} else if ($('#text-'+String(n_special)).val() === "") {
				if (forward && poll.question_list[current_question].type.response_list[n_special].explanation.required) {
					alert('Please enter some text.');
				}
			} else if(counter === 0) {
				if (forward) {
					alert('Please pick an option.');
				}
			} else {
				if (forward) {
					alert('Please pick only one option.');
				}
			}
			return false;
		} else if (poll.question_list[current_question].type.n > 1){
			// STUB: You should really ASSERT that counter >= 0 and counter <= ...response_list.length
			if(counter < 0) {
				if (forward) {
					alert('Something has gone terribly wrong; you\'ve selected less than zero answers.');
				}
			} else if (counter > poll.question_list[current_question].type.response_list.length) {
				if (forward) {
					alert('Something has gone terribly wrong; you\'ve selected more answers than exist.');
				}
			} else if (counter > poll.question_list[current_question].type.n) {
				if (forward) {
					alert('Please select no more than '+poll.question_list[current_question].type.n+' options.');
				}
			} else if (counter < poll.question_list[current_question].type.require) {
				if (forward) {
					alert('Please select at least '+poll.question_list[current_question].type.require+' options.');
				}
			} else {
				return true;
			}
			return false;
		}
	} else if (poll.question_list[current_question].type.name === 'slider') {
		// STUB: Check to see if slider is in valid range and divisible by increment. It's silly, I know...
		return true;
	} else if (poll.question_list[current_question].type.name === 'not_a_question') {
		return true;
	}
}

function updateBottomButtons() {

	if(poll.question_list[current_question].closing_slide) {

		//$('#nextquestion').addClass('ui-state-disabled');
		$('#nextquestion').hide();
		if(document.getElementById('submit') === null) {
			//temp = $('#verybottombuttons div').html();
			$('#verybottombuttons div').append('<a href="/polls" class="submit" id="submit" data-role="button" data-icon="carat-r" data-iconpos="right">Submit</a>');
			$('#verybottombuttons').trigger('create');
			$('#submit').show();
			$('#submit').on('click', submitPoll);
			//$('#verybottombuttons div').html(temp);
		} else {
			$('#submit').show();
			$('#submit').on('click', submitPoll);
		}
		$('#skipquestion').addClass('ui-state-disabled');
		$('#lastquestion').removeClass('ui-state-disabled');
	} else if(poll.question_list[current_question].opening_slide) {

		$('#submit').hide();
		$('#nextquestion').show();
		$('#nextquestion').removeClass('ui-state-disabled');
		$('#skipquestion').removeClass('ui-state-disabled');
		$('#lastquestion').addClass( 'ui-state-disabled' );
	} else {

		$('#submit').hide();
		$('#nextquestion').show();
		$('#nextquestion').removeClass('ui-state-disabled');
		$('#skipquestion').removeClass('ui-state-disabled');
		$('#lastquestion').removeClass('ui-state-disabled');
	}

	if ( !poll.allow_skipping && (typeof poll.question_list[current_question].allow_skipping === 'undefined' || !poll.question_list[current_question].allow_skipping)) {
		// STUB: Consider hiding the text on Skip in this case

		$('#skipquestion').addClass('ui-state-disabled');
		$('#skipquestion').innerHTML = '';
	}

	if ( !poll.allow_skipping && (typeof poll.question_list[current_question].allow_skipping !== 'undefined' && poll.question_list[current_question].allow_skipping)) {
		$('#skipquestion').removeClass('ui-state-disabled');
		$('#skipquestion').innerHTML = 'Skip';
	}
}

function findWithAttr(array, attr, value) {
	for(var i = 0; i < array.length; i += 1) {
		if(array[i][attr] === value) {
			return i;
		}
	}
}

function renderBottomButtons() {
	// Render 'back' and 'next' buttons
	var temp = '';
	temp += '<div id="verybottombuttons" data-role="controlgroup" data-type="horizontal" text-align="center" margin-left="auto" margin-right="auto" align="center">';
	temp += '<a href="#" class="lastquestion" id="lastquestion" data-transition="slide" data-direction= "reverse" data-role="button" data-icon="carat-l" data-iconpos="left">Back</a>';
	// STUB: Check to see if you should render a 'skip' button
	temp += '<a href="#" class="skipquestion" id="skipquestion" data-transition="slide" data-role="button">Skip</a>';
	temp += '<a href="#" class="nextquestion" id="nextquestion" data-transition="slide" data-role="button" data-icon="carat-r" data-iconpos="right">Next</a>';
	$('#bottombuttons').html(temp);
	$('#bottombuttons').trigger('create');
	updateBottomButtons();
}

function answer_question(forward) {
	// If we're valid OR we're going backwards
	if(validateCurrentQuestion(forward)) {
		// And if we have a pick_n style question
		if(poll.question_list[current_question].type.name === 'pick_n') {
			// For every question
			for (var i = 0; i < poll.question_list[current_question].type.response_list.length; i += 1) {

				// If the choice is checked
				if ($('#pick-choice-'+String(i)).is(':checked')) {
					// And if it's a radiobox
					if(poll.question_list[current_question].type.n === 1) {
						// Save it
						if ( typeof poll.question_list[current_question].type.response_list[i].explanation !== 'undefined' ) {
							poll.question_list[current_question].type.response_list[i].answers = [[user_token, true, $('#text-'+String(i)).val()]]
						} else {
							poll.question_list[current_question].type.response_list[i].answers = [[user_token, true, undefined]]
						}

						// Check for option-conditional branching; take it if possible
						if (forward && typeof poll.question_list[current_question].type.response_list[i]['next'] !== 'undefined') {
							current_question = poll.question_list[current_question].type.response_list[i]['next'];
							return true;
						}
					// OTHERWISE, if it's a pick_n, with n > 1
					} else {
						// For each response, save the current state
						poll.question_list[current_question].type.response_list[i].answers = [[user_token, true, undefined]];
						// Then check for option-conditional branching; take it if possible
						if (forward && typeof poll.question_list[current_question].type.response_list[i]['next'] !== 'undefined') {
							current_question = poll.question_list[current_question].type.response_list[i]['next'];
							return true;
						}
					}
				// OTHERWISE, if this option is not checked
				} else {

					// save only the explanation
					if ( typeof poll.question_list[current_question].type.response_list[i].answers !== 'undefined' && typeof poll.question_list[current_question].type.response_list[i].answers[0] !== 'undefined' && typeof poll.question_list[current_question].type.response_list[i].answers[0][2] !== 'undefined' ) {
						console.log('Soft overwriting answer '+i+'.');
						//poll.question_list[current_question].type.response_list[i].answers = [[undefined, undefined, $('#text-'+String(i)).val()]];
						poll.question_list[current_question].type.response_list[i].answers = [[undefined, undefined, poll.question_list[current_question].type.response_list[i].answers[0][2]]]
					} else {
						console.log('Hard overwriting answer '+i+'.');
						poll.question_list[current_question].type.response_list[i].answers = [[undefined, undefined, undefined]];
					}
				}
			}

		// OTHERWISE, if we have a slider style question
		} else if(poll.question_list[current_question].type.name === 'slider') {
			// STUB: Conditionally save slider text fields
			poll.question_list[current_question].type.response_list[0].answers = [[user_token, $('#slider').val()]];
		}

		// For all question types

		// If we have a hard-link to the next question, take it
		if (forward && typeof poll.question_list[current_question]['next'] !== 'undefined') {
			current_question = findWithAttr(poll.question_list, 'id', poll.question_list[current_question]['next']);
		// Otherwise, go forwards/backwards as appropriate
		} else if (forward) {
			current_question += 1;
		} else {
			current_question -= 1;
			return false;
		}
		return true
	// Otherwise, if invalid and going forwards
	} else {
		if (!forward) {
			current_question -= 1;
		}
		return false
	}
}

function nextQuestion() {
	if(answer_question(true)) {
		store_poll();
		updateBottomButtons();
		//update_text_field();
		renderCurrentQuestion(/*current_question*/);
		update_text_field();
		$.mobile.changePage($('#frontpage'), {allowSamePageTransition: true, transition: "slide"});
	}
	//update_text_field();
}

function lastQuestion() {
	// WARN: Currently, you 'lose' invalid answers when you hit back, but keep them if they're valid
	answer_question(false);
	store_poll();
	updateBottomButtons();
	//update_text_field();
	renderCurrentQuestion(/*current_question*/);
	update_text_field();
	$.mobile.changePage($('#frontpage'), {allowSamePageTransition: true, transition: "slide", reverse: true});
}

function skipQuestion() {

	if(poll.question_list[current_question].type.name === 'pick_n') {
		for (var i = 0; i < poll.question_list[current_question].type.response_list.length; i += 1) {
				poll.question_list[current_question].type.response_list[i].answers = [[user_token, undefined]];
		}
	} else if(poll.question_list[current_question].type.name === 'slider') {
		poll.question_list[current_question].type.response_list[0].answers = [[user_token, undefined]];
	}

	store_poll();
	current_question += 1;
	updateBottomButtons();
	renderCurrentQuestion(/*current_question*/);
	$.mobile.changePage($('#frontpage'), {allowSamePageTransition: true, transition: "slide"});
}

function clear_storage() {
	window.localStorage.removeItem('poll'+poll._id);
}

// DOM Ready =============================================================
$(document).ready(function() {


	// WARN: If problems with page transitions occur, this line is likely to blame
	$.mobile.changePage($('#frontpage'), {allowSamePageTransition: true});

	if (poll_is_stored()) {
		load_poll();
	} else {
		current_question = 0;
		store_poll();
	}
	renderCurrentQuestion();
	renderBottomButtons();

	$('#bottombuttons div div').on('click', 'a.nextquestion', nextQuestion);
	$('#bottombuttons div div').on('click', 'a.lastquestion', lastQuestion);
	$('#bottombuttons div div').on('click', 'a.skipquestion', skipQuestion);
});


//WARN: This is a terrible hack; the function gets called twice per click
//Once on uncheck of the old one, once on check the new one
//But it works and I'm not in the mood to question working.
$(document).change('.ui-radio-on', function () {
	//console.log(event.target.nodeName);
	if(event.target.nodeName === 'LABEL') {
		update_text_field();
	}

});

window.onbeforeunload = function() {
	// WARN: Unconditionally storing the poll may be a source of interesting errors!
	//store_poll();
	return "Do you want to leave this poll? Your progress will be saved.";

	// history.pushstate and location.hash
	// http://www.webdesignerdepot.com/2013/03/how-to-manage-the-back-button-with-javascript/
	// https://developer.mozilla.org/en-US/docs/Web/API/Window.onhashchange
	// https://developer.mozilla.org/en-US/docs/Web/API/window.location

	// history.forward disabling
	// http://viralpatel.net/blogs/disable-back-button-browser-javascript/
};