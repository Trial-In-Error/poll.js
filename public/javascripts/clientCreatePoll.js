firstLoad = true;
poll = {};

function checkNumeric(username) {
	//var alphabet = 'abcdefghijklmnopqrstuvwxyzåäö';
	//var numbers = '0123456789';
	//var legalCharacters = (alphabet).split('').concat(alphabet.toUpperCase().split('')).concat(numbers.split(''));
	var legalCharacters = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
	for (var character in username) {
		if(legalCharacters.indexOf(username[character]) === -1) {
			return false;
		}
	}
	return true;
};

function setupInformational() {
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
	// Reset the sliderForm to its default values
	$('#sliderBody').val('');
	$('#sliderLower').val('');
	$('#sliderUpper').val('');
	$('#sliderIncrement').val('');
	$('#sliderAddExplanation').prop('checked', false);
	$('#sliderAddExplanation').show();
	$('#sliderExplanation').val('');
	$('#sliderExplanation').hide();
	$('#sliderExplanationRequired').prop('checked', false);
	$('#sliderExplanationRequired').hide();
	$('#sliderExplanationHintText').val('');
	$('#sliderExplanationHintText').hide();

	// Show the sliderForm
	$('#sliderForm').show();

	// Set up the next button's behavior
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

function chooseQuestionType() {
	$('#questionTypeForm').show();
	$('#next').off();
	$('#next').on('click', function() {
		if($('#informational').is(':checked')) {
			console.log('Informational!');
			$('#questionTypeForm').hide();
			setupInformational();
		} else if ($('#pickOne').is(':checked')) {
			console.log('pickOne!');
		} else if ($('#pickSeveral').is(':checked')) {
			console.log('pickSeveral!');
		} else if ($('#slider').is(':checked')) {
			console.log('slider!');
			$('#questionTypeForm').hide()
			setupSlider();
		} else if ($('#textField').is(':checked')) {
			console.log('textField!');
			$('#questionTypeForm').hide();
			setupTextField();
		}
	});
}

function setupQuestionType() {
	if ($('#welcomeText').val().length <= 0) {
		alert('Please fill in all required fields!');
		setupIntro();
	} else {
		$('#introForm').hide();
		chooseQuestionType();
	}
}

function setupIntro() {
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
	$('#lead p').hide();
	//$('#form').css('display', 'none')
	$('#metadataForm').show();
	$('#bottomButtons').show();
	$('#next').show();
	$('#next').off();
	$('#next').on('click', setupIntro);
}

function pageShowHelper() {
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
};

$(window).bind('pageshow', pageShowHelper);