// Userlist data array for filling in info box
var userListData = [];

// Functions =============================================================

// Fill table with data
function populateTable() {

	// Empty content string
	var tableContent = '';

	// jQuery AJAX call for JSON
	$.getJSON( '/pollroute/listpolls', function( data ) {

		// Stick our user data array into a userlist variable in the global object
		userListData = data;

		// For each item in our JSON, add a table row and cells to the content string
		$.each(data, function(){
			tableContent += '<li>';
			tableContent += '<a href="/poll/' + this._id + '">';
			tableContent += '<h2>Poll '+ this.id + '</h2>';
			tableContent += '<p>';
			if(this.open)
			{
				tableContent += 'Open';
			}else{
				tableContent += 'Closed';
			}				
			tableContent += ', owned by ' + this.owner + ', and has the database hash ' + this._id+'</p></a>';
			//tableContent += '<td><a href="#" class="ui-btn ui-icon-delete ui-mini ui-btn-icon-notext ui-corner-all" rel="'+this._id+'">No text</a></td>'
			tableContent += '<a href="#" class="linkdeletepoll" rel="' + this._id + '">delete</a>';
			//tableContent += '<td><form><button type="ui-btn" value="Delete" style="width:100%"></form></td>'
			tableContent += '</li>';
		});

		// Inject the whole content string into our existing HTML table
		$('#listpoll ul').html(tableContent);
		//$('#listpoll ul').trigger('create');
		$('#listpoll ul').listview('refresh');
	});
}

// Show User info
/*function showUserInfo(event){
	// Prevent Link from Firing
	event.preventDefault();

	// Retrieve username from link rel attribute
	var thisUserName = $(this).attr('rel');

	// Get Index of object based on id value
	var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);

	// Get our User Object
	var thisUserObject = userListData[arrayPosition];

	// Populate Info Box
	$('#userInfoName').text(thisUserObject.fullname);
	$('#userInfoAge').text(thisUserObject.age);
	$('#userInfoGender').text(thisUserObject.gender);
	$('#userInfoLocation').text(thisUserObject.location);
}*/

// Add User
/*function addUser(event){
	event.preventDefault();

	// Basic validation - increase errorCount for each blank field
	var errorCount = 0;
	$('#addUser input').each(function(index, val){
		if($(this).val() === '') { errorCount += 1; }
	});

	// Check and make sure errorCount is zero
	if(errorCount === 0) {
		// If it is, pack all user info into one object
		var newUser = {
			'username': $('#addUser fieldset input#inputUserName').val(),
			'email': $('#addUser fieldset input#inputUserEmail').val(),
			'fullname': $('#addUser fieldset input#inputUserFullname').val(),
			'age': $('#addUser fieldset input#inputUserAge').val(),
			'location': $('#addUser fieldset input#inputUserLocation').val(),
			'gender': $('#addUser fieldset input#inputUserGender').val()
		};

		// Use AJAX to post the object to adduser service
		$.ajax({
			type: 'POST',
			data: newUser,
			url: '/users/adduser',
			dataType: 'JSON'
		}).done(function(response){
			// Check for successful (blank) response
			if(response.msg === '') {
				// Clear the form inputs
				$('#addUser fieldset input').val('');

				// Update the table
				populateTable();
			} else {
				// If something goes wrong, alert the error message
				alert('Error: '+ response.msg);
			}
		});
	} else {
			// If errorCount is more than 0, error out
			alert('Please fill in all fields.');
			return false;
	}
}*/

// Delete User
function deletePoll(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this poll?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/pollroute/deletepoll/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

}

// DOM Ready =============================================================
$(document).ready(function() {

	// Populate the user table on initial page load
	populateTable();

	// Username link click
	//$('#listpoll table tbody').on('click', 'td a.linkshowuser', showUserInfo);

	// Add User button click
	// $('#btnAddUser').on('click', addUser);

	// Delete Poll link click
    //$('#listpoll table tbody').on('click', 'td a.linkdeletepoll', deletePoll);
    $('#listpoll ul').on('click', 'li a.linkdeletepoll', deletePoll);

});