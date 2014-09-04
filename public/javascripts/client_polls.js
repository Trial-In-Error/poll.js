// Fill table with data
function populateTable() {

	// Empty content string
	var tableContent = '';
	// jQuery AJAX call for JSON
	$.getJSON( '/pollroute/listpolls', function( data ) {
		if(typeof data !== 'undefined' && typeof data.polls !== 'undefined') {
			// For each item in our JSON, add a table row and cells to the content string
			$.each(JSON.parse(data.polls), function(){
				tableContent += '<li>';
				tableContent += '<a href="/poll/' + this._id + '" rel="external" data-ajax="false">';
				tableContent += '<h2>'+ this.name + '</h2>';
				tableContent += '<p>';
				if(this.open)
				{
					tableContent += 'Open';
				}else{
					tableContent += 'Closed';
				}
				//tableContent += ', owned by ' + this.owner + ', and has the database hash ' + this._id+'.</p>';
				tableContent += ', owned by ' + this.owner + '.</p>';
				tableContent += '</a>';
				tableContent += '<div class="split-custom-wrapper">';
				if ( data.auth && typeof data.rights.delete !== 'undefined' && data.rights.delete) {
					//console.log('I can delete.');
					tableContent += '<a href="#" class="linkdeletepoll split-custom-button ui-btn-icon-notext" rel="'+this._id+'" data-role="button" data-icon="delete" data-iconpos="notext">delete</a>';
				}
				if ( data.auth && typeof data.rights.copy !== 'undefined' && data.rights.copy) {
					//console.log('I can copy.');
					tableContent += '<a href="#" class="linkcopypoll split-custom-button ui-btn-icon-notext" rel="'+this._id+'" data-role="button" data-icon="forward" data-iconpos="notext">copy</a>';
				}
				if ( data.auth && typeof data.rights.openClose !== 'undefined' && data.rights.openClose) {
					//console.log('I can open/close.');
					tableContent += '<a href="#" class="linkopenclosepoll split-custom-button ui-btn-icon-notext" rel="'+this._id+'" data-role="button" data-icon="lock" data-iconpos="notext">open/close</a>';
					//tableContent += '<a href="#" class="linksharepoll split-custom-button ui-btn-icon-notext" rel="'+this._id+'" data-role="button" data-icon="action" data-iconpos="notext">link</a>';
				}
				if (typeof data.rights !== 'undefined' && !(data.rights.delete || data.rights.copy || data.rights.openClose)) {
					//console.log('I can do nothing.');
					tableContent += '<a href="/poll/' + this._id + '" class="split-custom-button ui-btn-icon-notext" data-role="button" data-icon="carat-r" data-iconpos="notext">answer</a>';
					//tableContent += '<a href="#" class="linksharepoll split-custom-button ui-btn-icon-notext" rel="'+this._id+'" data-role="button" data-icon="action" data-iconpos="notext">link</a>';
				}
				tableContent += '</div></li>';
			});
		} else {
			location.reload();
		}

		// Inject the whole content string into our existing HTML table
		$('#listpoll ul').html(tableContent);
		$('#listpoll ul').trigger('create');
		$('#listpoll ul').listview('refresh');
	});
}

function openClosePoll() {
	event.preventDefault();
	var open, confirmation;

	// WARN: THIS PATH IS REALLY UNSTABLE AND DEPENDENT ON THE DOM. BE WARY.
	console.log($(this).parent().parent().children()[0].text);

	if ( $(this).parent().parent().children()[0].text.search('Open') !== -1) {
		open = true;
	} else {
		open = false;
	}
	// Pop up a confirmation dialog
	if(open) {
		confirmation = confirm('Are you sure you want to close this poll?');
	} else {
		confirmation = confirm('Are you sure you want to open this poll?');
	}

	// Check and make sure the user confirmed
	if (confirmation === true) {

		if(open) {
			$.ajax({
				type: 'POST',
				url: '/pollroute/closepoll/' + $(this).attr('rel')
			}).done(function( response ) {
				// Check for a successful (blank) response
				if (response.msg !== '') {
					alert('Error: ' + response.msg);
				}
				populateTable();
			});
		} else {
			$.ajax({
				type: 'POST',
				url: '/pollroute/openpoll/' + $(this).attr('rel')
			}).done(function( response ) {
				// Check for a successful (blank) response
				if (response.msg !== '') {
					alert('Error: ' + response.msg);
				}
				populateTable();
			});
		}

	}
}

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
	$('#listpoll ul').on('click', 'li a.linkopenclosepoll', openClosePoll);

});