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

var can_store = supports_html5_storage();

function store_poll() {
	if (can_store) {
		window.localStorage['poll'+poll._id] = JSON.stringify(poll);
		window.localStorage['current'+poll._id] = JSON.stringify(current_question);
	} else {
		//UNTESTED: fall back on window.namespace clobbering
		window['polljspoll'+poll._id] = poll;
		window['polljscurrent'+poll._id] = current_question;
	}
}

function load_poll() {
	if(can_store) {
		poll = JSON.parse(window.localStorage['poll'+window.location.pathname.split('poll/').slice(-1)]);
		current_question = parseInt(window.localStorage['current'+window.location.pathname.split('poll/').slice(-1)]);
	} else {
		//UNTESTED: load from window.namespace
		poll = window['polljspoll'+poll._id];
		current_question = window['polljscurrent'+poll._id];
	}
}

function poll_is_stored() {
	if(can_store) {
		return typeof window.localStorage["poll"+poll._id] !== 'undefined';
	} else {
		//UNTESTED: return window.namespace's existance
		return (typeof window['polljspoll'+poll._id] !== 'undefined'
			&& typeof window['polljscurrent'+poll._id] !== 'undefined');
	}
}

function render_text_field(counter) {
	// Renders a text field IFF it's needed. Safe to call when a text field is unnecessary.
	//counter -= 1;
	temp = '';
	var current_response = poll.question_list[current_question].type.response_list[counter];
	//temp += '<form>';
	if(typeof current_response !== 'undefined') {
		if ( typeof current_response['explanation'] !== 'undefined' ) {
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
				if ( typeof current_response.explanation['text'] !== 'undefined' ) {
					temp += '<textarea cols="40" rows="8" type="text" name="text-'+counter+'" id="text-'+counter+'" value="" placeholder="'+current_response.explanation['text']+'"></textarea>'
				} else {
					temp += '<textarea cols="40" rows="8" type="text" name="text-'+counter+'" id="text-'+counter+'" value=""></textarea>'
				}
			}
		}
		//temp += '</form>';
	} else {
		// WARN: This should be dev mode only
		alert('What the hell? We found an invalid call to render_text_field with counter = '+counter);
	}
	return temp;
}


function render_pick_n(temp) {
	// For each answer, draw a button
	temp += '<fieldset data-role="controlgroup">';
	
	//var counter = 0;
	for (var entry in poll.question_list[current_question].type.response_list) {
		// Create a button to click!
		// If N > 1, use check boxes, else use radio buttons
		if (poll.question_list[current_question].type.n === 1) {

			//MISSING OPEN FORM!!!

			//WARN: WAIT, AREN'T COUNTER AND ENTRY THE FUCKING SAME THING?

			// Draw radio buttons
			//alert(poll.question_list[current_question].type.response_list[entry].body);
			temp += '<input type="radio" name="pick-choice" id="pick-choice-'+entry+'" value="off">';
			temp += '<label for="pick-choice-'+entry+'">'+
					String(poll.question_list[current_question].type.response_list[entry].body)+'</label>';
		} else {
			// Draw check boxes
			temp += '<input type="checkbox" name="checkbox" id="pick-choice-'+entry+'">';
    		temp += '<label for="pick-choice-'+entry+'">'+
    				String(poll.question_list[current_question].type.response_list[entry].body)+'</label>';
		}
			// It should update entry.answers <---this happens in DOM ready
			// It should check entry.*_explainable when rendering
			//counter += 1;
			//temp += render_text_field(entry);
			//alert('Rendered counter '+entry+' as:'+temp);
	}
	return temp
}

function render_slider(temp) {
	//alert('min: '+ String(poll.question_list[current_question].type.min))
	//alert('max: '+ String(poll.question_list[current_question].type.max))
	// Draw slider
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

function renderCurrentQuestion() {
	alert('rendered!');
	var temp = '';
	//temp += '<form>';
	//current_question = qtr;
	//alert(poll.question_list[current_question].body)

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
	//alert('Injecting '+temp);
	$('#form').html(temp);
	//$('#form fieldset').trigger('create');
	init_current_question();
	
	modify_current_question();


}

function init_current_question() {
	$('#form').trigger('create');


}

function modify_current_question() {
	for (var counter in poll.question_list[current_question].type.response_list) {
		//$('#form fieldset').trigger('create');
		if (poll.question_list[current_question].type.name === "pick_n") {
			if( typeof poll.question_list[current_question].type.response_list[counter] !== 'undefined' && typeof poll.question_list[current_question].type.response_list[counter].answers[0] !== 'undefined') {
				//$('#pick-choice-'+String(counter)).parent().trigger('create');
				//$('#pick-choice-'+String(counter)).parent().checkboxradio();

				$('#pick-choice-'+String(counter)).checkboxradio();
				//$('#pick-choice-'+String(counter)).prop('checked', value);

				//$('#pick-choice-'+String(counter)).checkboxradio({ defaults: true});



				//$("#pick-choice-"+String(counter)).checkboxradio("refresh");




				//alert('Matched for counter '+counter+' and question '+current_question+'.');
			} else {
				//alert('No match for counter '+counter+' and question '+current_question+'.');
			}
		} /*else if (poll.question_list[current_question].type.name === "slider") {
			if( typeof poll.question_list[current_question].type.response_list[0] !== 'undefined' && typeof poll.question_list[current_question].type.response_list[0].answers[0] !== 'undefined') {
				$("#slider").val(poll.question_list[current_question].type.response_list[0].answers[0][1]);
				$( "#slider" ).slider("refresh");
			}	
		}*/
	}
}


function validateCurrentQuestion(forward) {
	var counter = 0;
	if (poll.question_list[current_question].type.name === 'pick_n') {
		for (i = 0; i < poll.question_list[current_question].type.response_list.length; i += 1) {
			if($('#pick-choice-'+String(i)).is(':checked')) {
				counter += 1;	
			}
		}
		if (poll.question_list[current_question].type.n === 1) {
			if(counter === 1) {
				return true;
			} else {
				if(counter === 0) {
					if (forward) {
						alert('Please pick an option.');
					}
				} else {
					if (forward) {
						alert('Please pick only one option.');
					}
				}
			}
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
			//$('#verybottombuttons div').html(temp);
		} else {
			$('#submit').show();
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
	temp += '<a href="#" class="lastquestion" id="lastquestion" data-role="button" data-icon="carat-l" data-iconpos="left">Back</a>';

	// Check to see if you should render a 'skip' button
	temp += '<a href="#" class="skipquestion" id="skipquestion" data-role="button">Skip</a>';
	temp += '<a href="#" class="nextquestion" id="nextquestion" data-role="button" data-icon="carat-r" data-iconpos="right">Next</a>';
	$('#bottombuttons').html(temp);
	initBottomButtons();
	updateBottomButtons();
}

function initBottomButtons() {
	$('#bottombuttons').trigger('create');
	$(':checkbox').checkboxradio({ defaults: true});
  	$(':radio').checkboxradio({ defaults: true});
}

function answer_question(forward) {
	if(validateCurrentQuestion(forward)) {
		if(poll.question_list[current_question].type.name === 'pick_n') {
			for (var i = 0; i < poll.question_list[current_question].type.response_list.length; i += 1) {
				if ($('#pick-choice-'+String(i)).is(':checked')) {
					//STUB: This is where you'd save the variable explanation fields, too, if present
					poll.question_list[current_question].type.response_list[i].answers = [[user_token, true]];
	
					if(poll.question_list[current_question].type.n === 1) {
						for (var j = 0; j < poll.question_list[current_question].type.response_list.length; j += 1) {
							if(i !== j) {
								poll.question_list[current_question].type.response_list[j].answers = [];
							}
						}
						if (forward && typeof poll.question_list[current_question].type.response_list[i]['next'] !== 'undefined') {
							current_question = poll.question_list[current_question].type.response_list[i]['next'];
							return true;
						}
					}
					
				} else {
					poll.question_list[current_question].type.response_list[i].answers = [];
				}
			}
		} else if(poll.question_list[current_question].type.name === 'slider') {
			poll.question_list[current_question].type.response_list[0].answers = [[user_token, $('#slider').val()]];
		}
		if (forward && typeof poll.question_list[current_question]['next'] !== 'undefined') {
			current_question = findWithAttr(poll.question_list, 'id', poll.question_list[current_question]['next']);
		} else if (forward) {
			current_question += 1;
		} else {
			current_question -= 1;
		}
		return true
	} else {
		if (!forward) {
			current_question -= 1;	
		}
		return false
	}
}

function skip_question() {
	if(poll.question_list[current_question].type.name === 'pick_n') {
		for (var i = 0; i < poll.question_list[current_question].type.response_list.length; i += 1) {
				poll.question_list[current_question].type.response_list[i].answers = [[user_token, undefined]];
		}
	} else if(poll.question_list[current_question].type.name === 'slider') {
		poll.question_list[current_question].type.response_list[0].answers = [[user_token, undefined]];
	}
}

//THESE THREE FUNCTIONS NEED:
	//ANSWER LOGGING
	//AWARENESS OF THE 'end of the line'
	//AWARENESS OF THE 'beginning of the line'
function nextQuestion() {
	if(answer_question(true)) {
		store_poll();
		updateBottomButtons();
		renderCurrentQuestion(/*current_question*/);
	}
}

function lastQuestion() {
	// WARN: Currently, you 'lose' invalid answers when you hit back, but keep them if they're valid
	answer_question(false);
	store_poll();
	updateBottomButtons();
	renderCurrentQuestion(/*current_question*/);
}

function skipQuestion() {
	//UNTESTED: skip_question()
	skip_question();
	
	store_poll();
	current_question += 1;
	updateBottomButtons();
	renderCurrentQuestion(/*current_question*/);
}

function clear_storage() {
	window.localStorage.removeItem('poll'+poll._id);
}

// DOM Ready =============================================================
$(document).ready(function() {


	if (poll_is_stored()) {
		load_poll();
	} else {
		current_question = 0;
		store_poll();
	}
	renderCurrentQuestion();
	renderBottomButtons();	
	
	//renderCurrentQuestion(/*current_question*/);
	//renderBottomButtons();


	$('#form input').on('click', renderCurrentQuestion);

    $('#bottombuttons div div').on('click', 'a.nextquestion', nextQuestion);
    $('#bottombuttons div div').on('click', 'a.lastquestion', lastQuestion);
    $('#bottombuttons div div').on('click', 'a.skipquestion', clear_storage);
});

/*$( document ).delegate("#frontpage", "pagebeforecreate", function() {
	if (poll_is_stored()) {
		load_poll();
	} else {
		current_question = 0;
		store_poll();
	}
	try {
		renderCurrentQuestion();
		renderBottomButtons();	
	} catch (err) {
		alert(err);
	}
	
});

$( document ).delegate("#frontpage", "pagecreate", function() {
  //$(':checkbox').checkboxradio({ defaults: true});
  //$(':radio').checkboxradio({ defaults: true});
  //$(':button').button({ defaults: true});
});*/