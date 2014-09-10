$(document).on('pageinit', function() {
	//$('#json').css({'height': '95% !important'});
	$(document).on('click', '#submit', function() {
		if($('#json').val().length > 0){
			// Send data to server through the ajax call
			// action is functionality we want to call and outputJSON is our data
			try {
				console.log(JSON.parse($('#json').val()));	
			} catch (err) {
				alert('Poll is not valid JSON.');
				return false;
			}
			$.ajax({
				url: '/pollroute/importpoll',
				data: JSON.parse($('#json').val()),
				type: 'post',
				async: 'true'//,
				//dataType: 'json'
			})
			.done(function (result) {
				//console.log('Done!');
				//window.location.replace(result.redirect);
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
				alert('Network error has occurred please try again!');
			});
		} else {
			alert('Please type or paste a poll into the field.')
		}
		return false; // cancel original event to prevent form submitting
	});
});