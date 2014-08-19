// Fill table with data
function populateTable() {

	// Empty content string
	var tableContent = '';

	// jQuery AJAX call for JSON
	$.getJSON( '/pollroute/listpolls', function( data ) {

		// For each item in our JSON, add a table row and cells to the content string
		$.each(JSON.parse(data.polls), function(){
			tableContent += '<li>';
			tableContent += '<a href="/poll/' + this._id + '" rel="external" data-ajax="false">';
			tableContent += '<h2>Poll '+ this.id + '</h2>';
			tableContent += '<p>';
			if(this.open)
			{
				tableContent += 'Open';
			}else{
				tableContent += 'Closed';
			}
			if ( !data.auth ) {
				tableContent += ', owned by ' + this.owner + ', and has the database hash ' + this._id+'</p></a>';	
			} else {
				tableContent += 'YOU HAVE DA POWA!'+'</p></a>';
			}
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