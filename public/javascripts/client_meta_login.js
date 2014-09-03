$(document).on('pageinit', function() {
	$(document).on('click', '#anonymous', function() {
			$.ajax({
				url: '/anonymous-login',
				data: {action : 'login'},
				type: 'post',
				async: 'true',
				dataType: 'json'
			})
			.done(function (result) {
				//console.log('Done!');
				//window.location.replace(result.redirect);
				console.log(result);
				if(result.success) {
					window.location.replace(result.redirect);
				} else {
					$('#login-failure p').html(result.message.message);
				}
			})
			.fail(function (request,error) {
				console.log('Fail!');
				// This callback function will trigger on unsuccessful action
				alert('Network error has occurred please try again!');
			});
		//return false; // cancel original event to prevent form submitting
	});
});