$(document).on('pageinit', function() {
	$(document).on('click', '#submit', function() {
		if($('#username').val().length > 0 && $('#password').val().length >= 5){
			// Send data to server through the ajax call
			// action is functionality we want to call and outputJSON is our data
			$.ajax({
				url: '/register',
				// WARN: This sends the password in the clear!!!
				data: {action : 'register', username : $('#username').val(), password : $('#password').val()},
				type: 'post',
				async: 'true',
				dataType: 'json'
			})
			.done(function (result) {
				//console.log('Done!');
				//window.location.replace(result.redirect);
				console.log(result);
				if(result.msg === "") {
					window.location.replace(window.location.origin+'/');
				} else {
					alert(result.msg);
					//$('#login-failure p').html(result.msg);
					$('#username').val('');
					$('#password').val('');
				}
			})
			.fail(function (request,error) {
				console.log('Fail!');
				// This callback function will trigger on unsuccessful action
				alert('Network error has occurred please try again!');
			});
		} else {
			if($('#username').val().length <= 0 && $('#password').val().length > 0) {
				alert('Please fill in your username.');
			} else if($('#username').val().length > 0 && $('#password').val().length <= 0) {
				alert('Please fill in your password.');
			} else if($('#password').val().length > 5) {
				alert('Please a choose a password at least 5 characters long.');
			} else {
				alert('Please fill in your username and password.');
			}
		}
		return false; // cancel original event to prevent form submitting
	});
});