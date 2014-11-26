// Don't warn about multi-line strings
/*jshint multistr: true */
// Don't warn about circular function references
/*jshint -W003 */
firstLoad = true;
poll = {};

function checkNumeric(string) {
	var legalCharacters = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
	for (var character in string) {
		if(legalCharacters.indexOf(string[character]) === -1) {
			return false;
		}
	}
	return true;
}

function submitPoll() {
	// Send data to server through the ajax call
	// action is functionality we want to call and outputJSON is our data
	try {
		console.log(JSON.stringify(poll));
	} catch (err) {
		alert('Poll is not valid JSON.');
		return false;
	}
	$.ajax({
		url: '/pollroute/importpoll',
		data: poll,
		type: 'post',
		async: 'true',
		dataType: 'json'
	})
	.done(function (result) {
		console.log(result);
		if(result.success) {
			window.location.replace(result.redirect);
		} else {
			alert(result.msg);
		}
	})
	.fail(function (request, error) {
		console.log('Fail!');
		// This callback function will trigger on unsuccessful action
		alert('Network error has occurred, please try again!');
	});
}

function chooseQuestionType() {
	document.body.scrollTop = document.documentElement.scrollTop = 0;
	$('#questionTypeForm').show();
	$('#next').off();
	$('#next').on('click', function() {
		if($('#informational').is(':checked')) {
			console.log('Informational!');
			$('#questionTypeForm').hide();
			setupInformational();
		} else if ($('#pickOne').is(':checked')) {
			console.log('pickOne!');
			$('#questionTypeForm').hide();
			setupPickOne();
		} else if ($('#pickSeveral').is(':checked')) {
			console.log('pickSeveral!');
			$('#questionTypeForm').hide();
			setupPickSeveral();
		} else if ($('#slider').is(':checked')) {
			console.log('slider!');
			$('#questionTypeForm').hide();
			setupSlider();
		} else if ($('#textField').is(':checked')) {
			console.log('textField!');
			$('#questionTypeForm').hide();
			setupTextField();
		}
	});
}

function setupPickSeveral() {
	document.body.scrollTop = document.documentElement.scrollTop = 0;
	var pickSeveralResponseCount = 0;
	$('#pickSeveralBody').val('');
	$('#pickSeveralResponses').empty();
	$('#pickSeveralForm').show();

	$('#pickSeveralRemoveResponse').off();
	$('#pickSeveralRemoveResponse').on('click', function() {
		if(pickSeveralResponseCount > 0) {
			pickSeveralResponseCount -= 1;
			console.log('Removing '+pickSeveralResponseCount);
			$('#pickSeveralResponse'+pickSeveralResponseCount).remove();
		}
	});

	// When you add a response...
	$('#pickSeveralAddResponse').off();
	$('#pickSeveralAddResponse').on('click', function() {
		//$('#pickSeveralResponses').append('<div id=pickSeveralResponse></div>');
		console.log(this.id);
		$('#pickSeveralResponses').append('<div id=pickSeveralResponse'+pickSeveralResponseCount+'></div>');
		$('#pickSeveralResponse'+pickSeveralResponseCount).append('<div class="ui-field-contain">\
			<label for="pickSeveralResponse'+pickSeveralResponseCount+'ResponseBody"> Response text:</label>\
			<input type="text" name="pickSeveralResponse'+pickSeveralResponseCount+'ResponseBody" id="pickSeveralResponse'+pickSeveralResponseCount+'ResponseBody">\
			</div>');

		$('#pickSeveralResponses').trigger('create');
		pickSeveralResponseCount += 1;

		// Set up the next button's behavior
		$('#next').off();
		$('#next').on('click', function() {
			var i;
			for(i = 0; i < pickSeveralResponseCount; i+=1) {
				if($('#pickSeveralResponse'+i+'ResponseBody').val().length <= 0) {
					alert('Please fill in all response body fields!');
					return;
				}
				if($('#pickSeveralBody').val().length <= 0) {
					alert('Please fill in the prompt.');
					return;
				}
			}
			var temp = {body: $('#pickSeveralBody').val(),
				type: {name: 'pick_n', n: pickSeveralResponseCount, require: 1,
					response_list: []
				}
			};
			for(i = 0; i < pickSeveralResponseCount; i+=1) {
				console.log('Pushing response '+i+' with value of '+ $('#pickSeveralResponse'+i+'ResponseBody').val());
				temp.type.response_list.push({body: $('#pickSeveralResponse'+i+'ResponseBody').val()});
			}
			poll.question_list.push(temp);
			$('#pickSeveralResponses').empty();
			$('#pickSeveralForm').hide();
			chooseQuestionType();
		});
	});
}

function setupPickOne() {
	document.body.scrollTop = document.documentElement.scrollTop = 0;
	var pickOneResponseCount = 0;
	$('#pickOneBody').val('');
	$('#pickOneResponses').empty();
	$('#pickOneForm').show();

	$('#pickOneRemoveResponse').off();
	$('#pickOneRemoveResponse').on('click', function() {
		if(pickOneResponseCount > 0) {
			pickOneResponseCount -= 1;
			console.log('Removing '+pickOneResponseCount);
			$('#pickOneResponse'+pickOneResponseCount).remove();
		}
	});

	// When you add a response...
	$('#pickOneAddResponse').off();
	$('#pickOneAddResponse').on('click', function() {
		//$('#pickOneResponses').append('<div id=pickOneResponse></div>');
		console.log(this.id);
		$('#pickOneResponses').append('<div id=pickOneResponse'+pickOneResponseCount+'></div>');
		$('#pickOneResponse'+pickOneResponseCount).append('<div class="ui-field-contain">\
			<label for="pickOneResponse'+pickOneResponseCount+'ResponseBody"> Response text:</label>\
			<input type="text" name="pickOneResponse'+pickOneResponseCount+'ResponseBody" id="pickOneResponse'+pickOneResponseCount+'ResponseBody">\
			</div>');
		$('#pickOneResponse'+pickOneResponseCount).append('<fieldset data-role="controlgroup" data-type="horizontal">\
			<input type="button" name="pickOneResponse'+pickOneResponseCount+'AddExplanation" id="pickOneResponse'+pickOneResponseCount+'AddExplanation" value="Add an explanation field.">\
			</fieldset>');

		// Set up the explanation toggle handler
		$('#pickOneResponse'+pickOneResponseCount+'AddExplanation').off();
		$('#pickOneResponse'+pickOneResponseCount+'AddExplanation').on('click', function() {
			var thisCount = this.id.split('Response')[1].split('Add')[0];
			console.log('Add/Remove clicked.'+thisCount);
			if($('#pickOneResponse'+thisCount+'ExplanationHintText').length <= 0) {
				console.log('Chose to add.');
				$('#pickOneResponse'+thisCount).append('<fieldset data-role="controlgroup" data-type="vertical"><form>\
					<div class="ui-field-contain">\
					<label for="pickOneResponse'+thisCount+'ExplanationHintText">Hint text:</label>\
					<input type="text" name="pickOneResponse'+thisCount+'ExplanationHintText" id="pickOneResponse'+thisCount+'ExplanationHintText">\
					</div>\
					<div class="ui-field-contain">\
					<label for="pickOneResponse'+thisCount+'ExplanationRequired">Explanation required?</label>\
					<input type="checkbox" data-role="flipswitch" data-on-text="Yes" data-off-text="No" name="pickOneResponse'+thisCount+'ExplanationRequired" id="pickOneResponse'+thisCount+'ExplanationRequired">\
					</div></form></fieldset>');
				$('#pickOneResponse'+thisCount+'AddExplanation').val('Remove explanation field.');
				$('#pickOneResponse'+thisCount+'AddExplanation').button('refresh');
				$('#pickOneResponse'+thisCount).trigger('create');
			} else {
				console.log('Chose to remove.');
				$('#pickOneResponse'+thisCount+'ExplanationRequired').parent().parent().parent().remove();
				//$('#pickOneResponse'+thisCount+'ExplanationHintText').parent().remove();
				$('#pickOneResponse'+thisCount+'AddExplanation').val('Add an explanation field.');
				$('#pickOneResponse'+thisCount+'AddExplanation').button('refresh');
				$('#pickOneResponse'+thisCount).trigger('create');
			}
		});

		$('#pickOneResponses').trigger('create');
		pickOneResponseCount += 1;

		// Set up the next button's behavior
		$('#next').off();
		$('#next').on('click', function() {
			var i;
			for(i = 0; i < pickOneResponseCount; i+=1) {
				if($('#pickOneResponse'+i+'ResponseBody').val().length <= 0) {
					alert('Please fill in all response body fields!');
					return;
				}
				if($('#pickOneBody').val().length <= 0) {
					alert('Please fill in the prompt.');
					return;
				}
			}
			var temp = {body: $('#pickOneBody').val(),
				type: {name: 'pick_n', n: 1, require: 1,
					response_list: []
				}
			};
			for(i = 0; i < pickOneResponseCount; i+=1) {
				console.log('Pushing response '+i+' with value of '+ $('#pickOneResponse'+i+'ResponseBody').val());
				// If the add explanation button says "Remove"...
				if( $('#pickOneResponse'+i+'AddExplanation').val().indexOf('Remove') !== -1 ) {
					//Then we know there's an explanation. Push it, too.
					temp.type.response_list.push({body: $('#pickOneResponse'+i+'ResponseBody').val(),
						explanation: {
							always_explainable: true,
							explain_text: $('#pickOneResponse'+i+'ExplanationHintText').val(),
							required: $('#pickOneResponse'+i+'ExplanationRequired').is(':checked'),
						}});
				} else {
					temp.type.response_list.push({body: $('#pickOneResponse'+i+'ResponseBody').val()});
				}
			}
			poll.question_list.push(temp);
			$('#pickOneResponses').empty();
			$('#pickOneForm').hide();
			chooseQuestionType();
		});
	});
}

function setupInformational() {
	document.body.scrollTop = document.documentElement.scrollTop = 0;
	// Reset the informationalForm to its default values
	$('#informationalBody').val('');

	// Show the informationalForm
	$('#informationalForm').show();

	// Set up the next button's behavior
	$('#next').off();
	$('#next').on('click', function() {
		if($('#informationalBody').val().length <= 0) {
			alert('Please fill in all required fields!');
		} else {
			poll.question_list.push({body: $('#informationalForm').val(), type: {name: 'not_a_question'}});
			$('#informationalForm').hide();
			chooseQuestionType();
		}
	});
}

function setupSlider() {
	document.body.scrollTop = document.documentElement.scrollTop = 0;
	// Reset the sliderForm to its default values
	$('#sliderBody').val('');
	$('#sliderLower').val('');
	$('#sliderUpper').val('');
	$('#sliderIncrement').val('');
	$('#sliderAddExplanation').parent().show();
	//$('#sliderAddExplanation').prop('checked', false);
	//$('#sliderAddExplanation').checkboxradio('refresh');
	$('#sliderAddExplanation').button('refresh');
	//$('#sliderRemoveExplanation').prop('checked', false);
	$('#sliderRemoveExplanation').button('refresh');
	$('#sliderRemoveExplanation').parent().hide();
	$('#sliderExplanation').hide();
	$('#sliderExplanationRequiredTrue').prop('checked', false);
	$('#sliderExplanationRequiredTrue').checkboxradio('refresh');
	$('#sliderExplanationRequiredFalse').prop('checked', true);
	$('#sliderExplanationRequiredFalse').checkboxradio('refresh');
	//$('#sliderExplanationRequired').hide();
	$('#sliderExplanationHintText').val('');
	//$('#sliderExplanationHintText').hide();

	// Show the sliderForm
	$('#sliderForm').show();

	$('#sliderRemoveExplanation').on('click', function() {
		$('#sliderExplanation').hide();
		$('#sliderAddExplanation').parent().show();
		//$('#sliderAddExplanation').prop('checked', false);
		//$('#sliderAddExplanation').checkboxradio('refresh');
		//$('#sliderRemoveExplanation').checkboxradio('refresh');
		$('#sliderRemoveExplanation').button('refresh');
		$('#sliderRemoveExplanation').parent().hide();
	});

	$('#sliderAddExplanation').on('click', function() {
		$('#sliderExplanation').show();
		$('#sliderRemoveExplanation').parent().show();
		//$('#sliderRemoveExplanation').prop('checked', false);
		//$('#sliderRemoveExplanation').checkboxradio('refresh');
		$('#sliderRemoveExplanation').button('refresh');
		$('#sliderAddExplanation').parent().hide();
		//$('#sliderTextFieldRequired').show();
		//$('#sliderExplanationHintText').show();
	});

	// Set up the next button's behavior
	// STUB: VALIDATE FOR EXPLANATION FILLED OUT
	$('#next').off();
	$('#next').on('click', function() {
		if( $('#sliderBody').val().length <= 0
			|| $('#sliderLower').val().length <= 0
			|| $('#sliderUpper').val().length <= 0
			|| $('#sliderIncrement').val().length <= 0 ) {
			alert('Please fill in all required fields! Make sure to user only numbers in the bound and increment fields.');
		} else if( !checkNumeric($('#sliderLower').val())
			|| !checkNumeric($('#sliderUpper').val())
			|| !checkNumeric($('#sliderIncrement').val()) ) {
			alert('Please use only numbers in the bound and increment fields!');
		} else {
			var temp = {body: $('#sliderBody').val(),
				type: {name: 'slider', min: $('#sliderLower').val(), max: $('#sliderUpper').val(), step: $('#sliderIncrement').val(),
					response_list: [{}]
				}
			};
			if( $('#sliderRemoveExplanation').is(':visible') ) {
				temp.type.response_list[0].explanation = {};
				temp.type.response_list[0].explanation.always_explainable = true;
				temp.type.response_list[0].explanation.explain_text = $('#sliderExplanationHintText').val();
				temp.type.response_list[0].explanation.required = $('#sliderExplanationRequiredTrue').prop('checked');
			}
			poll.question_list.push(temp);
			$('#sliderForm').hide();
			chooseQuestionType();
		}
	});
}

function setupTextField() {
	document.body.scrollTop = document.documentElement.scrollTop = 0;
	// Reset the textFieldForm to its default values
	$('#textFieldBody').val('');
	$('#textFieldHint').val('');
	$('#textFieldRequiredTrue').prop('checked', false);
	$('#textFieldRequiredTrue').checkboxradio('refresh');
	$('#textFieldRequiredFalse').prop('checked', true);
	$('#textFieldRequiredFalse').checkboxradio('refresh');


	// Show the textFieldForm
	$('#textFieldForm').show();

	// Set up the next button's behavior
	$('#next').off();
	$('#next').on('click', function() {
		if($('#textFieldBody').val().length <= 0) {
			alert('Please fill in all required fields!');
		} else {
			poll.question_list.push({body: $('#textFieldBody').val(),
				type: {name: 'open',
					response_list: [ { explanation:
						{ always_explainable: true, explain_text: $('#textFieldHint').val(), required:$('#textFieldRequiredTrue').prop('checked') }
					} ]
				}
			});
			$('#textFieldForm').hide();
			chooseQuestionType();
		}
	});
}

function setupIntro() {
	document.body.scrollTop = document.documentElement.scrollTop = 0;
	$('#introForm').show();
	$('#next').off();
	$('#next').on('click', function() {
		if ($('#welcomeText').val().length <= 0) {
			alert('Please fill in the welcome text!');
			//setupPoll();
			return;
		} else {
			$('#introForm').hide();
			poll.question_list = [];
			poll.question_list.push({body: $('#welcomeText').val(), type:{name: 'not_a_question'}, opening_slide: true});
			chooseQuestionType();
		}
	});
}

function setupPoll() {
	document.body.scrollTop = document.documentElement.scrollTop = 0;
	$('#lead p').hide();
	//$('#form').css('display', 'none')
	$('#metadataForm').show();
	$('#bottomButtons').show();
	$('#next').show();
	$('#next').off();
	$('#next').on('click', function() {
		if ($('#pollName').val().length <= 0 || $('#pollCreator').val().length <= 0) {
			alert('Please fill in all required fields!');
			return;
		} else {
			poll.name = $('#pollName').val();
			poll.owner = $('#pollCreator').val();
			poll.open = true;
			// STUB: ASSUMES SWEDISH
			poll.language = 'swedish';
			$('#metadataForm').hide();
			setupIntro();
		}
	});
}

function pageShowHelper() {
	document.body.scrollTop = document.documentElement.scrollTop = 0;
	// WARN: If problems with page transitions occur, this line is likely to blame
	//$.mobile.changePage($('#frontpage'), {allowSamePageTransition: true});
	console.log('pageShow!');

	if(firstLoad) {
		firstLoad = false;
		setupPoll();
	}

	window.onbeforeunload = function() {
		return 'Do you want to leave this poll? Your progress will not be saved!';
	};
}

$(window).bind('pageshow', pageShowHelper);
/*jshint +W003 */