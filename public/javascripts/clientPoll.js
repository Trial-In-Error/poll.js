var current_question;
var value = Math.floor((Math.random() * 1000000)+1);
var user_token = ('00000000' + value).slice(-8);

eval($('#data')[0].innerHTML); // jshint ignore:line
var firstRun = true;

/**
 *	Checks if browser supports html5's localStorage. Note that, by design, it checks for both sessionStorage and localStorage being supported.
 *	Called as a helper in many functions; storePoll(), loadPoll(), pollIsStored(), and clearStorage().
 *	@returns {boolean} - Whether or not HTML5 localStorage and sessionStorage are available.
 *	//CONSIDER: simplifying to a variable
 */
function supportsHTML5Storage() {
	try {
		if('localStorage' in window && 'sessionStorage' in window && window.sessionStorage !== null && window.localStorage !== null) {
			window.localStorage.setItem('supportTest', 'did this work?');
			window.localStorage.removeItem('supportTest');
			return true;
		} else {
			return false;
		}
	} catch (e) {
		return false;
	}
}

/**
 *	Cleans the finished poll of unnecessary explanations before submitPoll() POSTs it.
 *	Called in submitPoll(); its callback is used by the ajax POST that is the second half of submitPoll.
 */
function storePoll() {
	if (supportsHTML5Storage()) {
		window.localStorage['poll'+window.location.pathname.toLowerCase().split('poll/').slice(-1)] = JSON.stringify(poll);
		if(current_question !== 0) {
			window.localStorage['current'+window.location.pathname.toLowerCase().split('poll/').slice(-1)] = JSON.stringify(current_question);
		} else {
			window.localStorage['current'+window.location.pathname.toLowerCase().split('poll/').slice(-1)] = 0;
		}

	} else {
		// WARN: THIS IS UNCLEAR AND AMBIGUOUS
		if (firstRun) {
			if(checkLanguage !== 'english') {
				alert('Your progress will not be saved until you submit the completed poll.\n\n To enable incremental saving, leave private browsing mode.');
			} else {
				alert('Din svar kommer ej att sparas förrän du har slutfört formuläret \n\n För att spara kontinuerligt var god att lämna privat surf.');
				
			}
			
			firstRun = false;
		}

		// STUB: SHOULD USE COOKIES FOR BACKUP IF ANYTHING
		//window['polljspoll'+poll._id] = poll;
		//window['polljscurrent'+poll._id] = current_question;
	}
}

// STUB: COMMENT ME!
// STUB: Extend for overriding (i.e., in case of skip)
function genEmptyAnswers() {
	return [{value: undefined, user: undefined, explanation: undefined, skipped: false, timestamp: undefined}];
}

/**
 *	Clears the local storage only for the poll currently stored in the local poll variable.
 *	If supported, HTML5's localStorage is used. Otherwise, the data is appended to window directly.
 *	As such, this function conditionally clears the type of storage used.
 */
function clearStorage() {
	if ( supportsHTML5Storage() ) {
		window.localStorage.removeItem('poll'+window.location.pathname.toLowerCase().split('poll/').slice(-1));
		window.localStorage.removeItem('current'+window.location.pathname.toLowerCase().split('poll/').slice(-1));
	} else {
		//window['polljspoll'+poll._id] = undefined;
		//window['polljscurrent'+poll._id] = undefined;
	}
}

/**
 *	Cleans the finished poll of unnecessary explanations before submitPoll() POSTs it.
 *	Called in submitPoll(); its callback is used by the ajax POST that is the second half of submitPoll.
 */
function cleanPoll(callback) {
	//console.log('Cleaning poll.');
	for (var question in poll.question_list) {
		for (var response in poll.question_list[question].type.response_list) {
			try {
				if(typeof poll.question_list[question].type.response_list !== 'undefined'
					&& typeof poll.question_list[question].type.response_list[response].answers !== 'undefined'
					&& typeof poll.question_list[question].type.response_list[response].explanation !== 'undefined'
					&& typeof poll.question_list[question].type.response_list[response].answers[0] !== 'undefined'
					&& (poll.question_list[question].type.response_list[response].answers[0].value === false
						|| poll.question_list[question].type.response_list[response].answers[0].value === undefined)) {
					console.log('Question '+question+' had response '+response+' with the values of '+JSON.stringify(poll.question_list[question].type.response_list[response].answers[0])+'. Cleared!' );
					poll.question_list[question].type.response_list[response].answers = genEmptyAnswers();
				}
			} catch (err) {
				console.log(err+' '+question+' '+response);
				//console.log(poll);
			}
			//console.log(poll);
		}
	}
	callback();
}

/**
 *	Validates the current question, returning either true or false.
 *	Called by answerQuestion() when nextQuestion() or lastQuestion() are called by clicking a bottom button.
 *	Note that this is not called by skipQuestion(); this is intentional.
 *	Decides if the current question should be stored, then decides if the current question should be changed.
 *	Always changes the current question on backward (lastQuestion()), but stores the response first if it's valid.
 *	@param {boolean} forward - Indicates if answerQuestion() is requesting to go forwards or backwards.
 *	@returns {boolean} - Indicates whether or not it's acceptable to move in the direction indicated by forward.
 */
function validateCurrentQuestion(forward) {
	var counter = 0;
	// STUB: Generalize to an array to support checkbox explanations...
	// STUB: Comment me!!!
	var n_special = 0;
	// If we're doing a pick_n
	if (poll.question_list[current_question].type.name === 'pick_n') {
		for (i = 0; i < poll.question_list[current_question].type.response_list.length; i += 1) {
			if($('#pick-choice-'+String(i)).is(':checked')) {
				counter += 1;
				n_special = i;
			}
		}
		//console.log(counter);
		// If we're picking 1 from a list
		if (poll.question_list[current_question].type.n === 1 || poll.question_list[current_question].type.n === '1') {
			//console.log('We\'re picking 1 from a list.');
			// And we have picked 1, and (explanation not required OR explanation provided)
			if(counter === 1 &&
				(poll.question_list[current_question].type.response_list[n_special].explanation &&
				!poll.question_list[current_question].type.response_list[n_special].explanation.required ||
				$('#text-'+String(n_special)).val() !== '')) {
				//console.log('But we short circuited the logic.');
				// Then we're valid
				return true;
			// Otherwise, we're invalid, and let's find out how
			} else if ($('#text-'+String(n_special)).val() === '') {
				if (forward && poll.question_list[current_question].type.response_list[n_special].explanation.required) {
					if(checkLanguage() === 'english') {
						alert('Please enter some text.');
					} else {
						alert('Vad god och fyll i ett svar för alternativet du valde.');
					}
				}
			} else if(counter === 0) {
				if (forward) {
					if(checkLanguage() === 'english') {
						alert('Please pick an option.');	
					} else {
						alert('Vad god och välj ett alternativ');
					}
				}
			} else {
				if (forward) {
					if(checkLanguage() === 'english') {
						alert('Please pick only one option.');	
					} else {
						alert('Endast ett alternativ är tillåtet');
					}
				}
			}
			return false;
		} else if (poll.question_list[current_question].type.n > 1){
			// STUB: You should really ASSERT that counter >= 0 and counter <= ...response_list.length
			if(counter < 0) {
				if (forward) {
					if(checkLanguage() === 'english') {
						alert('Something has gone terribly wrong; you\'ve selected less than zero answers.');
					} else {
						alert('Det har uppstått ett allvarligt fel, du har valt mindre än noll alternativ');
					}
				}
			} else if (counter > poll.question_list[current_question].type.response_list.length) {
				if (forward) {
					if(checkLanguage() === 'english') {
						alert('Something has gone terribly wrong; you\'ve selected more answers than exist.');						
					} else {
						alert('Det har uppstått ett allvarligt fel, du har valt fler alternativ än tillgängligt');
					}
				}
			} else if (counter > poll.question_list[current_question].type.n) {
				if (forward) {
					if(checkLanguage() === 'english') {
						alert('Please select no more than '+poll.question_list[current_question].type.n+' options.');
					} else {
						alert('Var god och välj max '+poll.question_list[current_question].type.n+' alternativ.');
					}
				}
			} else if (counter < poll.question_list[current_question].type.require) {
				if (forward) {
					if(checkLanguage() === 'english') {
						alert('Please select at least '+poll.question_list[current_question].type.require+' options.');						
					} else {
						alert('Var god och välj minst '+poll.question_list[current_question].type.require+' alternativ');
					}
				}
			} else {
				return true;
			}
			return false;
		}
	} else if (poll.question_list[current_question].type.name === 'slider') {
		if(typeof poll.question_list[current_question].type.response_list === 'undefined'
			|| typeof poll.question_list[current_question].type.response_list[0].explanation === 'undefined'
			|| typeof poll.question_list[current_question].type.response_list[0].explanation.required === 'undefined') {
			return true;
		} else if((poll.question_list[current_question].type.response_list[0].explanation.required === false
				|| poll.question_list[current_question].type.response_list[0].explanation.required === 'false')) {
			return true;	
		} else if($('#text-0').val() <= 0){
			if(checkLanguage() === 'english') {
				alert('Please fill in the textbox.');	
			} else {
				alert('Var god och fyll i textrutan');
			}
		} else {
			return true;
		}
		// STUB: Check to see if slider is in valid range and divisible by increment. It's silly, I know...
		
	} else if (poll.question_list[current_question].type.name === 'not_a_question') {
		return true;
	} else if (poll.question_list[current_question].type.name === 'open') {
		// If we aren't required to answer it, return true
		if(typeof poll.question_list[current_question].type.response_list[0].explanation.required !== 'undefined'
			&& (poll.question_list[current_question].type.response_list[0].explanation.required === false
				|| poll.question_list[current_question].type.response_list[0].explanation.required === 'false') ) {
			return true;
		} else if ( $('#text-0').val() !== '') {
			return true;
		} else if (forward) {
			if(checkLanguage() === 'english') {
				alert('Please enter some text.');	
			} else {
				alert('Var god och fyll i textrutan');
			}
		}
		return false;
	}
}

/**
 *	Finds an element in an array by matching element[attribute] === value.
 *	In other words, find the element that has a property with a given value.
 *	Called as a helper in answerQuestion() to follow 'next' links.
 *	@param {array} array - The array to be searched.
 *	@param {string} attr - The field of each member of the array to match on.
 *	@param {???} value - The value to match the attribute on.
 */
function findWithAttr(array, attr, value) {
	for(var i = 0; i < array.length; i += 1) {
		if(array[i][attr] === value) {
			return i;
		}
	}
}

/**
 *	Checks the response's validity, saves it if valid, then changes the current_question as appropriate.
 *	Always saves text fields.
 *	Calls validateCurrentQuestion() to check validity.
 *	Called by nextQuestion() and lastQuestion().
 *	@param {boolean} forward - True if trying to go forwards, false if trying to go backwards.
 *	@return {boolean} - True if you current_question++, false if current_question--
 */
function answerQuestion(forward) {
	// If we're valid OR we're going backwards
	if(validateCurrentQuestion(forward)) {
		// And if we have a pick_n style question
		if(poll.question_list[current_question].type.name === 'pick_n') {
			// For every response
			for (var i = 0; i < poll.question_list[current_question].type.response_list.length; i += 1) {
				// If the choice is checked
				if ($('#pick-choice-'+String(i)).is(':checked')) {
					// And if it's a radiobox
					if(poll.question_list[current_question].type.n === 1 || poll.question_list[current_question].type.n === '1') {
						// Save it
						if ( typeof poll.question_list[current_question].type.response_list[i].explanation !== 'undefined' ) {
							poll.question_list[current_question].type.response_list[i].answers =
								[{user: user_token, value: true, explanation: $('#text-'+String(i)).val(), timestamp: $.now()}];
						} else {
							poll.question_list[current_question].type.response_list[i].answers =
								[{user: user_token, value: true, explanation: undefined, timestamp: $.now()}];
						}
						// Check for option-conditional branching; take it if possible
						if (forward && typeof poll.question_list[current_question].type.response_list[i].next !== 'undefined') {
							current_question = poll.question_list[current_question].type.response_list[i].next;
							return true;
						}
					// OTHERWISE, if it's a pick_n, with n > 1
					} else {
						// For each response, save the current state
						poll.question_list[current_question].type.response_list[i].answers = [{user: user_token, value: true, explanation: undefined, timestamp: $.now()}];
						// Then check for option-conditional branching; take it if possible
						if (forward && typeof poll.question_list[current_question].type.response_list[i].next !== 'undefined') {
							current_question = poll.question_list[current_question].type.response_list[i].next;
							return true;
						}
					}
				// OTHERWISE, if this option is not checked
				} else {

					// save only the explanation
					if ( typeof poll.question_list[current_question].type.response_list[i].answers !== 'undefined'
						&& typeof poll.question_list[current_question].type.response_list[i].answers[0] !== 'undefined'
						&& typeof poll.question_list[current_question].type.response_list[i].answers[0].value !== 'undefined' ) {
						//console.log('Soft overwriting answer '+i+'.');
						//poll.question_list[current_question].type.response_list[i].answers = [[undefined, undefined, $('#text-'+String(i)).val()]];
						poll.question_list[current_question].type.response_list[i].answers =
							[{user: undefined, value: undefined, explanation: poll.question_list[current_question].type.response_list[i].answers[0].explanation}];
					} else {
						//console.log('Hard overwriting answer '+i+'.');
						poll.question_list[current_question].type.response_list[i].answers =
							genEmptyAnswers();
					}
				}
			}

		// OTHERWISE, if we have a slider style question
		} else if(poll.question_list[current_question].type.name === 'slider') {
			// if the response list doesn't exist, first create it
			if (typeof poll.question_list[current_question].type.response_list === 'undefined') {
				poll.question_list[current_question].type.response_list = [{}];
			}
			// then, add this response, with or without an explanation
			if ( typeof poll.question_list[current_question].type.response_list[0].explanation !== 'undefined' ) {
				poll.question_list[current_question].type.response_list[0].answers =
					[{user: user_token, value: $('#slider').val(), explanation: $('#text-0').val(), timestamp: $.now()}];
			} else {
				poll.question_list[current_question].type.response_list[0].answers =
					[{user: user_token, value: $('#slider').val(), explanation: undefined, timestamp: $.now()}];
			}
		// OTHERWISE, if we have an open style question
		} else if(poll.question_list[current_question].type.name === 'open') {
			poll.question_list[current_question].type.response_list[0].answers =
					[{user: user_token, value: undefined, explanation: $('#text-0').val(), timestamp: $.now()}];
		} else if(poll.question_list[current_question].type.name === 'not_a_question') {
			//do no work, but prevents the griping from the else clause below
		} else {
			console.log('UNEXPECTED QUESTION TYPE!!!');
		}

		// For all question types

		// If we have a hard-link to the next question, take it
		if (forward && typeof poll.question_list[current_question].next !== 'undefined') {
			current_question = findWithAttr(poll.question_list, 'id', poll.question_list[current_question].next);
		// Otherwise, go forwards/backwards as appropriate
		} else if (forward) {
			current_question += 1;
		} else {
			current_question -= 1;
			return false;
		}
		return true;
	// Otherwise, if invalid and going forwards
	} else {
		if (!forward) {
			current_question -= 1;
		}
		return false;
	}
}

function batchSanitize(items) {
	console.log('BATCHSAN!');
	for(var tr in items) {
		if(!items[tr]) {
			console.log(JSON.stringify(items));
			return false;
		}
		for(var question in items[tr].question_list) {
			for(var response in items[tr].question_list[question].type.response_list) {
				console.log('Deleted '+items[tr].question_list[question].type.response_list[response].answers);
				delete items[tr].question_list[question].type.response_list[response].answers;
				//console.log('Now it\s '+ items[tr].question_list[question].type.response_list[response].answers);
			}
		}
	}
	return items;
}

/**
 *	POSTs the finished poll to the server.
 *	Starts by cleaning the poll of unnecessary explanations, then POSTs.
 *	Upon receiving OK from server, deletes local storage of the poll and returns to /polls/.
 */
function submitPoll() {
	if(answerQuestion(true)) {
		console.log('Submitting: '+JSON.stringify(poll));
		window.onbeforeunload = function() {};
		var tempID = window.location.pathname.toLowerCase().split('poll/').slice(-1);
		cleanPoll( function () {
				$.ajax({
				type: 'POST',
				data: poll,
				url: '/pollroute/answerpoll',
				dataType: 'JSON'
				}).done(function(response){
				//window.onbeforeunload = function() {};
				// STUB: Lock this user out of this poll in the future, server-side
				// Check for successful (blank) response
				console.log('Response: '+JSON.stringify(response));
				if ( response.msg === '' ) {
					// Delete local storage of results
					// WARN: Do onbeforeunload more elegantly?
					//current_question = 0;
					//clearStorage();
					//console.log(batchSanitize([poll])[0]);
					poll = {};
					console.log('Submission complete; sanitizing local storage.');
					$(window).unbind('pageshow');
					//clearStorage();
					window.localStorage.removeItem('poll'+tempID);
					window.localStorage.removeItem('current'+tempID);
					//window.location.replace('/polloverview/'+tempID);
					//window.localStorage['poll'+tempID] = JSON.stringify(batchSanitize([poll])[0]);
					//window.localStorage['current'+tempID] = 0;
					current_question = 0;
					//console.log('SUBMITPOLL CURRENT QUESTION'+current_question);
					//clearStorage();
					//poll = batchSanitize([poll])[0];
					//poll = undefined;

				} else {
					// If something went wrong, alert the error message
					if(checkLanguage() === 'swedish') {
						alert('Error: '+response.msg);	
					} else {
						alert('Fel: ' + response.msg);
					}
				}
			});
		});
	}
}

/**
 *	Checks to see if the 'current' poll is stored locally.
 *	Calls supportsHTML5Storage() to determine where to look for the locally stored poll.
 *	Called by DOM.ready(), which uses the return type to decide to loadPoll() or storePoll().
 *	Note that the network traffic of sending the poll is done regardless of whether or not it's needed.
 *	//STUB: This could be optimized so it only requests the poll when it will use it.
 *	@returns {boolean} - Whether or not the poll is properly stored locally.
 */
function loadPoll() {
	if ( supportsHTML5Storage() ) {
		console.log(window.location.pathname.toLowerCase().split('poll/').slice(-1));
		poll = JSON.parse(window.localStorage['poll'+window.location.pathname.toLowerCase().split('poll/').slice(-1)]);
		console.log('LOADPOLL PRE CURRENT QUESTION'+current_question);
		current_question = parseInt(window.localStorage['current'+window.location.pathname.toLowerCase().split('poll/').slice(-1)]);
		console.log('LOADPOLL POST CURRENT QUESTION'+current_question);
	} else {
		// STUB: DOESN'T WORK. CONSIDER COOKIES INSTEAD
		//alert(window.location.pathname.split('poll/').slice(-1));
		//poll = window['polljspoll'+window.location.pathname.split('poll/').slice(-1)];
		//current_question = window['polljscurrent'+window.location.pathname.split('poll/').slice(-1)];
	}
}

/**
 *	Checks to see if the 'current' poll is stored locally.
 *	Calls supportsHTML5Storage() to determine where to look for the locally stored poll.
 *	Called by DOM.ready(), which uses the return type to decide to loadPoll() or storePoll().
 *	Note that the network traffic of sending the poll is done regardless of whether or not it's needed.
 *	//STUB: This could be optimized so it only requests the poll when it will use it.
 *	@returns {boolean} - Whether or not the poll is properly stored locally.
 */
function pollIsStored() {
	if(supportsHTML5Storage()) {
		return typeof window.localStorage['poll'+window.location.pathname.toLowerCase().split('poll/').slice(-1)] !== 'undefined';
	} else {
		//UNTESTED: return window.namespace's existance
		//alert(poll._id);
		//alert(typeof window['polljspoll'+poll._id]);
		//return (typeof window['polljspoll'+poll._id] !== 'undefined'
		//	&& typeof window['polljscurrent'+poll._id] !== 'undefined');
		return false;
	}
}

/**
 *	Returns HTML string, temp, to be appended to the HTML string in its caller.
 *	This appending is the caller's responsibility. Called by renderPickN() for every question.
 *	This function is safe to call when unnecessary;
 *	The actual injection, rendering, and inflation occurs in renderCurrentQuestion(), after renderPickN() returns.
 *	@param {int} counter - The number of the response the text field might be rendered for. Not to be confused with current_question!
 *	@returns {string} temp - The HTML string describing the text field. Caller must append to its own HTML string.
 */
function renderTextField(counter) {
	// Renders a text field IFF it's needed. Safe to call when a text field is unnecessary.
	temp = '';
	var current_response = poll.question_list[current_question].type.response_list[counter];
	if(typeof current_response !== 'undefined' && typeof current_response.explanation !== 'undefined' /*&& $('#text-'+String(counter)).length === 0*/ ) {
		// WARN: ONLY PICK-N WILL CONDITIONALLY WORK
		// BECAUSE OF PICK-CHOICE+i
		// STUB: COLUMNS AND ROWS NOT MUTABLE
		// STUB: data-clear-btn="true" DOES NOT WORK WITH TEXTAREAS
		if ( current_response.explanation.always_explainable || ($('#pick-choice-'+String(counter)).is(':checked')) ) {
			if ( typeof current_response.explanation.label !== 'undefined' ) {
				temp += '<label for="text-'+counter+'">'+current_response.explanation.label+'</label>';
			} else {
				temp += '<label for="text-'+counter+'" class="ui-hidden-accessible"></label>';
			}
			if ( typeof current_response.explanation.explain_text !== 'undefined' ) {
				temp += '<textarea cols="40" rows="8" type="text" name="text-'+counter+'" id="text-'+counter+'" value="" placeholder="'+current_response.explanation.explain_text+'"></textarea>';
			} else {
				temp += '<textarea cols="40" rows="8" type="text" name="text-'+counter+'" id="text-'+counter+'" value=""></textarea>';
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
function renderPickN(temp) {
	// For each answer, draw a button
	temp += '<fieldset data-role="controlgroup">';

	//var counter = 0;
	for (var entry in poll.question_list[current_question].type.response_list) {
		// Create a button to click!
		// If N > 1, use check boxes, else use radio buttons
		if (poll.question_list[current_question].type.n === 1 || poll.question_list[current_question].type.n === '1') {

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
			temp += renderTextField(entry);
	}
	return temp;
}

/**
 *	Appends HTML to the string temp corresponding to this question's slider.
 *	The actual injection, rendering, and inflation occurs in renderCurrentQuestion().
 *	Called in renderCurrentQuestion().
 *	@param {string} temp - The HTML string that is passed in.
 *	@returns {string} temp - The HTML string that is passed in, after being appended to.
 */
function renderSlider(temp) {
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

// STUB: DOCUMENT ME
function renderOpen(temp) {
	temp = renderTextField();
	return temp;
}

/**
 *	Creates and updates text fields.
 *	Conditionally either creates a text field, updates a text field with local poll's data, sets a text field to blank, or deletes a text field.
 *	The poll is not modified at all in this function.
 *	Called on ui-radio-btn.change(), nextQuestion(), lastQuestion(), and renderCurrentQuestion().
 *	Curiosly enough, it is NOT called in skipQuestion(). This is an oversight.
 *	// WARN: This function is almost certainly being called more often than necessary.
 *	// WARN: THIS IS AN AWFUL, UNDOCUMENTED MESS
 */
function updateTextField() {
	var temp;
	// If it's not_a_question, or otherwise has no responses, do no work
	if(typeof poll.question_list[current_question].type.response_list === 'undefined') {
		return;
	}

	for (var counter in poll.question_list[current_question].type.response_list) {
		temp = '';
		//WARN: Use current_response to simplify code below!!!
		var current_response = poll.question_list[current_question].type.response_list[counter];
		if(typeof current_response !== 'undefined' && typeof current_response.explanation !== 'undefined') {
			// WARN: ONLY PICK-N WILL CONDITIONALLY WORK
			// BECAUSE OF PICK-CHOICE+i
			// STUB: COLUMNS AND ROWS NOT MUTABLE

			// If the question is (always explainable AND does not exist) OR (it is checked AND the text field does not exist)
			if ( (current_response.explanation.always_explainable && document.getElementById('text-'+String(counter)) === null && $('#text-'+String(counter)).length === 0)  ||
				($('#pick-choice-'+String(counter)).is(':checked')
				&& document.getElementById('text-'+String(counter)) === null && $('#text-'+String(counter)).length === 0 )) {
				// Then create the damn thing
				//console.log(document.getElementById('text-'+String(counter)));
				//console.log('We fully created text area #:'+counter);
				if ( typeof current_response.explanation.label !== 'undefined' ) {
					temp += '<label for="text-'+counter+'">'+current_response.explanation.label+'</label>';
				} else {
					temp += '<label for="text-'+counter+'" class="ui-hidden-accessible"></label>';
				}

				//console.log('current_response.answers: '+JSON.stringify(current_response.answers, null, 4));
				if ( typeof current_response !== 'undefined' && typeof current_response.explanation.explain_text !== 'undefined' && (typeof current_response.answers === 'undefined' || typeof current_response.answers[0].explanation === 'undefined')) {
					temp += '<textarea cols="40" rows="8" type="text" name="text-'+counter+'" id="text-'+counter+'" value="" placeholder="'+current_response.explanation.explain_text+'"></textarea>';
				} else if(typeof current_response.answers !== 'undefined' && typeof current_response.answers[0].explanation !== 'undefined') {
					temp += '<textarea cols="40" rows="8" type="text" name="text-'+counter+'" id="text-'+counter+'" value="">'+current_response.answers[0].explanation+'</textarea>';
				} else {
					temp += '<textarea cols="40" rows="8" type="text" name="text-'+counter+'" id="text-'+counter+'" value=""></textarea>';
				}
				// WARN: This code happens n times for n text fields; maybe expensive
				if(poll.question_list[current_question].type.name === 'pick_n') {
					$('#pick-choice-'+String(counter)).parent().after(temp);
				} else if (poll.question_list[current_question].type.name === 'slider') {
					$('#slider').parent().after(temp);
				} else if (poll.question_list[current_question].type.name === 'open') {
					$('#form').html(temp);
					if(typeof current_response.answers !== 'undefined'
						&& typeof current_response.answers[0].explanation !== 'undefined') {
						//console.log('WERT');
						$('#form').trigger('create');
						$('#text-0').val(current_response.answers[0].explanation);
					}
				} else {
					console.log('UNEXPECTED CASE!');
					console.log(poll.question_list[current_question].type.name);
				}

				$('#form').trigger('create');
				$('.ui-radio').off('click', updateTextField);
				$('.ui-radio').on('click', updateTextField);

			// If the textfield exists, the explanation stored in local poll is defined, and it is checked
			} else if ( $('#text-'+String(counter)) !== 'undefined'
				&& typeof current_response.answers !== 'undefined'
				&& current_response.answers !== null
				&& typeof current_response.answers[0] !== 'undefined'
				&& typeof current_response.answers[0].explanation !== 'undefined'
				&& $('#pick-choice-'+String(counter)).is(':checked') ) {
					// Then render that explanation text in it.
					$('#text-'+String(counter)).val(current_response.answers[0].explanation);

			// Else, if it is not checked, the explanation stored in local poll is undefined, and it is always renderable
			} else if ( $('#text-'+String(counter)) !== 'undefined'
				&& typeof current_response.answers !== 'undefined'
				&& current_response.answers[0] !== null
				&& typeof current_response.answers[0] !== 'undefined'
				&& typeof current_response.answers[0].explanation !== 'undefined'
				&& !$('#pick-choice-'+String(counter)).is(':checked')
				&& current_response.explanation.always_explainable
				&& (poll.question_list[current_question].type.name !== 'open')) {
					// Then render nothing in the textbox (allowing the hint to show through)
					$('#text-'+String(counter)).val('');

			// Else, if it is not checked, the explanation stored in local poll is undefined, and it is not always renderable
			} else if ( !current_response.explanation.always_explainable
				&& typeof $(this) !== 'undefined'
				&& $(this).attr('id') !== 'pick-choice-'+String(counter) && !$('#pick-choice-'+String(counter)).is(':checked')) {
				// Then delete the textbox
				$('#text-'+String(counter)).remove();
			}
		}
	}
}

/**
 *	Sets check boxes, radio buttons, and sliders to the values stored in the local poll object.
 *	Called at the end of renderCurrentQuestion, and nowhere else.
 */
function modifyCurrentQuestion() {
	for (var counter in poll.question_list[current_question].type.response_list) {
		if (poll.question_list[current_question].type.name === 'pick_n') {
			if( typeof poll.question_list[current_question].type.response_list[counter] !== 'undefined'
				&& typeof poll.question_list[current_question].type.response_list[counter].answers !== 'undefined'
				&& poll.question_list[current_question].type.response_list[counter].answers[0] !== null
				&& typeof poll.question_list[current_question].type.response_list[counter].answers[0] !== 'undefined'
				&& poll.question_list[current_question].type.response_list[counter].answers[0].value !== null
				&& typeof poll.question_list[current_question].type.response_list[counter].answers[0].value !== 'undefined') {
				$('#pick-choice-'+String(counter)).checkboxradio();
				$('#pick-choice-'+String(counter)).prop('checked', value);
				$('#pick-choice-'+String(counter)).checkboxradio('refresh');
			} else {
				// WARN: ?! what was supposed to be here?!
			}
		} else if (poll.question_list[current_question].type.name === 'slider') {
			if( typeof poll.question_list[current_question].type.response_list[0] !== 'undefined'
				&& typeof poll.question_list[current_question].type.response_list[counter].answers !== 'undefined'
				&& typeof poll.question_list[current_question].type.response_list[0].answers[0] !== 'undefined') {
				$('#slider').val(poll.question_list[current_question].type.response_list[0].answers[0].value);
				$( '#slider' ).slider('refresh');
			}
		}
	}
}

/**
 *	Renders the current question by calling appropriate helper functions.
 *	Conditionally calls either renderPickN() or renderSlider() to generate HTML.
 *	HTML is then injected inside the #form div and inflated.
 *	Then, calls modifyCurrentQuestion() and updateTextField().
 *	Called on DOM.ready(), nextQuestion(), lastQuestion(), and skipQuestion().
 */
function renderCurrentQuestion() {
	var temp = '';

	$('#lead p').html(poll.question_list[current_question].body);

	if (poll.question_list[current_question].type.name === 'pick_n') {
		temp += temp.concat(renderPickN(temp));
	} else if (poll.question_list[current_question].type.name === 'slider') {
		temp += temp.concat(renderSlider(temp));
	} else if (poll.question_list[current_question].type.name === 'open') {
		temp += temp.concat(renderOpen(temp));
	}

	temp += '</fieldset>';
	temp += '</form>';
	temp = '<form>'.concat(temp);
	$('#form').html(temp);
	$('#form').trigger('create');

	modifyCurrentQuestion();
	updateTextField();
}

/**
 *	Updates the bottom button set. Buttons are never deleted or added, only shown, hidden, enabled, and disabled.
 *	Called by renderBottomButtons(), nextQuestion(), lastQuestion(), and skipQuestion().
 *	Requires that opening_slide and closing_slide are correctly labeled in the poll's .json!
 */
function updateBottomButtons() {
	if(poll.question_list[current_question].closing_slide || poll.question_list[current_question].closing_slide === 'true') {
		//$('#nextquestion').addClass('ui-state-disabled');
		$('#nextquestion').hide();
		if(document.getElementById('submit') === null) {
			//temp = $('#verybottombuttons div').html();
			$('#verybottombuttons div').append('<a href="/polloverview/'+poll._id+'" class="submit" id="submit" data-role="button" data-icon="carat-r" data-iconpos="right">Submit</a>');
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
	} else if(poll.question_list[current_question].opening_slide || poll.question_list[current_question].opening_slide === 'true') {
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

	if ( (poll.allow_skipping === 'false' || !poll.allow_skipping) && (typeof poll.question_list[current_question].allow_skipping === 'undefined' || !poll.question_list[current_question].allow_skipping)) {
		// STUB: Consider hiding the text on Skip in this case
		$('#skipquestion').addClass('ui-state-disabled');
		$('#skipquestion').innerHTML = '';
	}

	if ( (poll.allow_skipping !== 'false' || !poll.allow_skipping) && (typeof poll.question_list[current_question].allow_skipping !== 'undefined' && poll.question_list[current_question].allow_skipping)) {
		$('#skipquestion').removeClass('ui-state-disabled');
		$('#skipquestion').innerHTML = 'Skip';
	}
	$('#bottombuttons').trigger('create');
}

/**
 *	Generates the bottom buttons, injects them into #bottombuttons, and then inflates them.
 *	Called exclusively in DOM.ready(). After that, the buttons are only modified, never deleted or created.
 *	Calls updateBottomButtons() after creating the buttons to ensure that they're in the correct states.
 */
function renderBottomButtons() {
	// Render 'back' and 'next' buttons
	var temp = '';
	if(checkLanguage() === 'english') {
		temp += '<div id="verybottombuttons" data-role="controlgroup" data-type="horizontal" text-align="center" margin-left="auto" margin-right="auto" align="center">';
		temp += '<a href="#" class="lastquestion" id="lastquestion" data-transition="slide" data-direction= "reverse" data-role="button" data-icon="carat-l" data-iconpos="left">Back</a>';
		// STUB: Check to see if you should render a 'skip' button
		temp += '<a href="#" class="skipquestion" id="skipquestion" data-transition="slide" data-role="button">Skip</a>';
		temp += '<a href="#" class="nextquestion" id="nextquestion" data-transition="slide" data-role="button" data-icon="carat-r" data-iconpos="right">Next</a>';
	} else {
		temp += '<div id="verybottombuttons" data-role="controlgroup" data-type="horizontal" text-align="center" margin-left="auto" margin-right="auto" align="center">';
		temp += '<a href="#" class="lastquestion" id="lastquestion" data-transition="slide" data-direction= "reverse" data-role="button" data-icon="carat-l" data-iconpos="left">Bakåt</a>';
		// STUB: Check to see if you should render a 'skip' button
		temp += '<a href="#" class="skipquestion" id="skipquestion" data-transition="slide" data-role="button">Hoppa</a>';
		temp += '<a href="#" class="nextquestion" id="nextquestion" data-transition="slide" data-role="button" data-icon="carat-r" data-iconpos="right">Nästa</a>';		
	}
	$('#bottombuttons').html(temp);
	$('#bottombuttons').trigger('create');
	updateBottomButtons();
}

function checkLanguage() {
	// If this specific question is flagged for english...
	if(poll.question_list[current_question].language !== 'undefined' && poll.question_list[current_question].language === 'english') {
		return 'english';
	// Else, if this specific question is flagged for swedish...
	} else if (poll.question_list[current_question].language !== 'undefined' && poll.question_list[current_question].language === 'swedish') {
		return 'swedish';
	// Else, if this whole poll is flagged for english...
	} else if (poll.language !== 'undefined' && poll.language === 'english') {
		return 'english';
	// Else, if this whole poll is flagged for english...
	} else if (poll.language !== 'undefined' && poll.language === 'swedish') {
		return 'swedish';
	// Else, default to swedish...
	} else {
		return 'swedish';
	}
}

/**
 *	Calls answerQuestion() to save the local poll, check question validity, and present alerts if input is invalid.
 *	If input is valid, answerQuestion() changes the current_question
 *	Then, updateBottomButtons(), renderCurrentQuestion, and updateTextField() do work necessary to re-render the page.
 */
function nextQuestion() {
	if(answerQuestion(true)) {
		storePoll();
		updateBottomButtons();
		//updateTextField();
		renderCurrentQuestion();
		updateTextField();
		$.mobile.changePage($('#frontpage'), {allowSamePageTransition: true, transition: 'slide'});
	}
	//updateTextField();
}

/**
 *	Calls answerQuestion() to save the local poll, check question validity, and change the current_question.
 *	In this case, answerQuestion() always changes the current_question, but only saves if input is valid.
 *	Also note that alerts are not generated for bad inputs when going backwards.
 *	Then, updateBottomButtons(), renderCurrentQuestion, and updateTextField() do work necessary to re-render the page.
 */
function lastQuestion() {
	// WARN: Currently, you 'lose' invalid answers when you hit back, but keep them if they're valid
	answerQuestion(false);
	storePoll();
	updateBottomButtons();
	//updateTextField();
	renderCurrentQuestion();
	updateTextField();
	$.mobile.changePage($('#frontpage'), {allowSamePageTransition: true, transition: 'slide', reverse: true});
}

//STUB: STUBSTUB
function skipQuestion() {
	if ( poll.question_list[current_question].type.name === 'pick_n' ) {
		for (var i = 0; i < poll.question_list[current_question].type.response_list.length; i += 1) {
				poll.question_list[current_question].type.response_list[i].answers = [{user: user_token, value: undefined, explanation: undefined, skipped:true}];
		}
	} else if (poll.question_list[current_question].type.name === 'slider' ) {
		poll.question_list[current_question].type.response_list[0].answers = [{user: user_token, value: undefined, explanation: undefined, skipped:true}];
	}
	storePoll();
	current_question += 1;
	updateBottomButtons();
	renderCurrentQuestion(/*current_question*/);
	//STUB: Change transition to be distinct from 'nextQuestion'!
	$.mobile.changePage($('#frontpage'), {allowSamePageTransition: true, transition: 'slide'});
}

/**
 *	Called once on page load.
 *	Calls pollIsStored(), loadPoll(), storePoll() to manipulate the locally saved poll.
 *	Calls renderCurrentQuestion(), renderBottomButtons() to render the current question properly.
 *	Calls ajax.on('click'...) for each of the bottom buttons to link the click event to the proper functions.
 *	//WARN: This may be an inappropriate way to do setup with Jquery Mobile. Look into it.
 */
//$(document).ready(function() {

function pageShowHelper() {
	// WARN: If problems with page transitions occur, this line is likely to blame
	//$.mobile.changePage($('#frontpage'), {allowSamePageTransition: true});
	console.log('pageShow!');
	if(window.location.pathname.toLowerCase() === '/polls') {
		//nothing
	} else {
		if (pollIsStored()) {
				console.log('poll loaded');
				//current_question = 0;
				loadPoll();
			} else {
				if(firstRun) {
					console.log('poll stored');
					eval($('#data')[0].innerHTML); // jshint ignore:line
					current_question = 0;
					storePoll();
				}
			}
			renderCurrentQuestion();
			renderBottomButtons();

			if(firstRun) {
				firstRun = false;
				window.onbeforeunload = function() {
					return 'Do you want to leave this poll? Your progress will be saved.';
					// history.pushstate and location.hash
					// http://www.webdesignerdepot.com/2013/03/how-to-manage-the-back-button-with-javascript/
					// https://developer.mozilla.org/en-US/docs/Web/API/Window.onhashchange
					// https://developer.mozilla.org/en-US/docs/Web/API/window.location
					// history.forward disabling
					// http://viralpatel.net/blogs/disable-back-button-browser-javascript/
				};
			}

		$('#bottombuttons div div').on('click', 'a.nextquestion', nextQuestion);
		$('#bottombuttons div div').on('click', 'a.lastquestion', lastQuestion);
		$('#bottombuttons div div').on('click', 'a.skipquestion', skipQuestion);
	}

		/**
	 *	Asks the user to confirm leaving or refreshing the page before POSTing the answered poll.
	 *	Because it's attached to window, it must be overwritten manually(i.e., will persist through to the next URI/URL visited!).
	 */

//});
}

//WARN: This is a terrible hack; the function gets called twice per click
//Once on uncheck of the old one, once on check the new one
//But it works and I'm not in the mood to question working.
$(document).change('.ui-radio-on', function () {
	//console.log(event.target.nodeName);
	if(event.target.nodeName === 'LABEL') {
		updateTextField();
	}

});



window.onunload = function() {};

//window.addEventListener( 'pagehide', function() { console.log( 'page hide' ); } );
//window.addEventListener( 'pageshow', pageShowHelper, false );

$(window).bind('pageshow', pageShowHelper);

$( document ).on( "swipeleft", ".ui-page", function( event ) {
	nextQuestion();
});
// The same for the navigating to the previous page
$( document ).on( "swiperight", ".ui-page", function( event ) {
	lastQuestion();
});