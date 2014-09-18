$(document).on('pageinit', function() {
	$(document).on('click', '#submit', function() {
		var maxUsernameLength = 32;
		var maxPasswordLength = 32;
		if( $('#username').val().length > 0 && $('#username').val().length <= maxUsernameLength
			&& $('#password').val().length >= 5 && $('#password').val().length <= maxPasswordLength ){
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
				if(result.msg === '') {
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
			} else if ($('#username').val().length > 0 && $('#password').val().length <= 0) {
				alert('Please fill in your password.');
			} else if ($('#password').val().length < 5 && $('#username').val().length > 0) {
				alert('Please a choose a password at least 5 characters long.');
			} else if ($('#username').val().length > maxUsernameLength) {
				alert('Please choose a username shorter than '+maxUsernameLength+' characters.');
			} else if ($('#password').val().length > maxPasswordLength) {
				alert('Please choose a password shorter than '+maxPasswordLength+' characters.');
			} else {
				alert('Please fill in your username and password.');
			}
		}
		return false; // cancel original event to prevent form submitting
	});
});