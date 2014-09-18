$(document).on('pageinit', function() {
	$(document).on('click', '#submit', function() {
		var maxUsernameLength = 32;
		var maxPasswordLength = 32;
		var username = $('#username').val();
		var password = $('#password').val();
		if( username.length > 0 && username.length <= maxUsernameLength
			&& password.length >= 5 && password.length <= maxPasswordLength ){
			// Send data to server through the ajax call
			// action is functionality we want to call and outputJSON is our data
			$.ajax({
				url: '/register',
				// WARN: This sends the password in the clear!!!
				data: {action : 'register', username : username, password : password},
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
			if(username.length <= 0 && password.length > 0) {
				alert('Please fill in your username.');
			} else if (username.length > 0 && password.length <= 0) {
				alert('Please fill in your password.');
			} else if (password.length < 5 && username.length > 0) {
				alert('Please choose a password at least 5 characters long.');
			} else if (username.length > maxUsernameLength && password.length <= maxPasswordLength) {
				alert('Please choose a username shorter than '+maxUsernameLength+' characters.');
			} else if (username.length <= maxUsernameLength && password.length > maxPasswordLength) {
				alert('Please choose a password shorter than '+maxPasswordLength+' characters.');
			} else if (username.length > maxUsernameLength && password.length > maxPasswordLength) {
				alert('Please choose a username shorter than '+maxUsernameLength+' characters and a password shorter than '+maxPasswordLength+' characters.');
			} else if (username.length <= 0 && password.length <= 0) {
				alert('Please fill in your username and password.');
			} else {
				alert('Something went wrong.');
			}
		}
		return false; // cancel original event to prevent form submitting
	});
});