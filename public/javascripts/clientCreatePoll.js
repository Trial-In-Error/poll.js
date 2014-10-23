firstLoad = true;
poll = {};

function checkNumeric(string) {
	//var alphabet = 'abcdefghijklmnopqrstuvwxyzåäö';
	//var numbers = '0123456789';
	//var legalCharacters = (alphabet).split('').concat(alphabet.toUpperCase().split('')).concat(numbers.split(''));
	var legalCharacters = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
	for (var character in string) {
		if(legalCharacters.indexOf(string[character]) === -1) {
			return false;
		}
	}
	return true;
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

function setupPickOne() {
	document.body.scrollTop = document.documentElement.scrollTop = 0;
	var pickOneResponseCount = 0;
	$('#pickOneBody').val('');
	$('#pickOneResponses').empty();
	$('#pickOneForm').show();

	// When you add a response...
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
		// When you click to toggle the explanation...
		$('#pickOneResponse'+pickOneResponseCount+'AddExplanation').on('click', function() {
			var thisCount = this.id.split("Response")[1].split("Add")[0]
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
				$('#pickOneResponse'+thisCount+'ExplanationRequired').parent().remove();
				$('#pickOneResponse'+thisCount+'ExplanationHintText').remove();
				$('#pickOneResponse'+thisCount+'AddExplanation').val('Add an explanation field.')
				$('#pickOneResponse'+thisCount+'AddExplanation').button('refresh');
				$('#pickOneResponse'+thisCount).trigger('create');
			}
		});
		$('#pickOneResponses').trigger('create');
		pickOneResponseCount += 1;

		// Set up the next button's behavior
		$('#next').off();
		$('#next').on('click', function() {
			if($('#informationalBody').val().length <= 0) {
				alert('Please fill in all required fields!');
			} else {
				$('#informationalForm').hide();
				chooseQuestionType();
			}
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
	})

	$('#sliderAddExplanation').on('click', function() {
		$('#sliderExplanation').show();
		$('#sliderRemoveExplanation').parent().show();
		//$('#sliderRemoveExplanation').prop('checked', false);
		//$('#sliderRemoveExplanation').checkboxradio('refresh');
		$('#sliderRemoveExplanation').button('refresh');
		$('#sliderAddExplanation').parent().hide();
		//$('#sliderTextFieldRequired').show();
		//$('#sliderExplanationHintText').show();
		
	})

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
			$('#textFieldForm').hide();
			chooseQuestionType();
		}
	});
}



function setupQuestionType() {
	document.body.scrollTop = document.documentElement.scrollTop = 0;
	if ($('#welcomeText').val().length <= 0) {
		alert('Please fill in all required fields!');
		setupIntro();
	} else {
		$('#introForm').hide();
		chooseQuestionType();
	}
}

function setupIntro() {
	document.body.scrollTop = document.documentElement.scrollTop = 0;
	if ($('#pollName').val().length <= 0 || $('#pollCreator').val().length <= 0) {
		alert('Please fill in all required fields!');
		setupPoll();
	} else {
		$('#next').off();
		$('#next').on('click', setupQuestionType);
		$('#metadataForm').hide();
		$('#introForm').show();
	}
}

function setupPoll() {
	document.body.scrollTop = document.documentElement.scrollTop = 0;
	$('#lead p').hide();
	//$('#form').css('display', 'none')
	$('#metadataForm').show();
	$('#bottomButtons').show();
	$('#next').show();
	$('#next').off();
	$('#next').on('click', setupIntro);
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