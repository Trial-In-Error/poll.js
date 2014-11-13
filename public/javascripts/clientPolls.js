//window.onerror = function(error) {
//    alert(error);
//};

function constructRow(tableContent, poll, data) {
	tableContent += '<li>';
	// WARN: THIS CONDITIONAL IS SHIT DESIGN; IT'S DUPLICATED BELOW AND HAS ALREADY CAUSED ME PROBLEMS
	// WARN: ALSO, IT'S HIDING THE SHIT DESIGN THAT IS IMPORTPOLL
	if(poll.open === true || poll.open === 'true') {
		tableContent += '<a href="/poll/' + poll._id + '" rel="external" data-ajax="false">';
	} else {
		tableContent += '<a href="/polloverview/' + poll._id + '" rel="external" data-ajax="false">';
	}
	tableContent += '<h2>'+ poll.name + '</h2>';
	tableContent += '<p>';
	tableContent += 'Created by ' + poll.owner + '.</p>';
	if(poll.open === true || poll.open === 'true') {
		tableContent += '<h4 style="display:none;"> open </h4>';
	} else {
		tableContent += '<h4 style="display:none;"> closed </h4>';
	}

	tableContent += '</a>';
	tableContent += '<div class="split-custom-wrapper">';
	if ( data.auth && typeof data.rights.delete !== 'undefined' && data.rights.delete) {
		//console.log('I can delete.');
		tableContent += '<a href="#" class="linkdeletepoll split-custom-button ui-btn-icon-notext" rel="'+poll._id+'" data-role="button" data-icon="delete" data-iconpos="notext"></a>';
	}
	if ( data.auth && typeof data.rights.copy !== 'undefined' && data.rights.copy) {
		//console.log('I can copy.');
		tableContent += '<a href="#" class="linkcopypoll split-custom-button ui-btn-icon-notext" rel="'+poll._id+'" data-role="button" data-icon="forward" data-iconpos="notext"></a>';
	}
	if ( data.auth && typeof data.rights.openClose !== 'undefined' && data.rights.openClose) {
		//console.log('I can open/close.');
		tableContent += '<a href="#" class="linkopenclosepoll split-custom-button ui-btn-icon-notext" rel="'+poll._id+'" data-role="button" data-icon="lock" data-iconpos="notext"></a>';
		//tableContent += '<a href="#" class="linksharepoll split-custom-button ui-btn-icon-notext" rel="'+this._id+'" data-role="button" data-icon="action" data-iconpos="notext">link</a>';
	}
	//if (typeof data.rights !== 'undefined' && !(data.rights.delete || data.rights.copy || data.rights.openClose)) {
	//	//console.log('I can do nothing.');
	//	tableContent += '<a href="/poll/' + this._id + '" class="split-custom-button ui-btn-icon-notext" data-role="button" data-icon="carat-r" data-iconpos="notext">answer</a>';
	//	//tableContent += '<a href="#" class="linksharepoll split-custom-button ui-btn-icon-notext" rel="'+this._id+'" data-role="button" data-icon="action" data-iconpos="notext">link</a>';
	//}
	tableContent += '</div></li>';
	return tableContent;
}

// Fill table with data
function populateTable() {
	var tableContent = '';
	var openPolls = [];
	var closedPolls = [];

	// jQuery AJAX call for JSON
	$.getJSON( '/pollroute/listpolls', function( data ) {
		if (typeof data !== 'undefined' && typeof data.polls !== 'undefined') {
			$.each(JSON.parse(data.polls), function() {
				// WARN: THIS IS SHIT DESIGN; IT'S DUPLICATED ABOVE AND HAS ALREADY CAUSED ME PROBLEMS
				if (this.open === true || this.open === 'true') {
					openPolls.push(this);
				} else {
					closedPolls.push(this);
				}
			});

			tableContent += '<li data-theme="b" data-role="collapsible" data-collapsed="false" data-iconpos="right" data-inset="false"> <h2>Open Polls</h2>';
			tableContent += '<ul data-theme="a" data-role="listview">';
			for (var openIndex in openPolls) {
				tableContent = constructRow(tableContent, openPolls[openIndex], data);
			}
			tableContent += '</ul></li>';

			tableContent += '<li data-theme="b" data-role="collapsible" data-collapsed="false" data-iconpos="right" data-inset="false"> <h2>Closed Polls</h2>';
			tableContent += '<ul data-theme="a" data-role="listview">';
			for (var closedIndex in closedPolls) {
				tableContent = constructRow(tableContent, closedPolls[closedIndex], data);
			}
			tableContent += '</ul></li';

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
	console.log($(this).parent().parent().children().children().next().next().text().search('open'));

	if ( $(this).parent().parent().children().children().next().next().text().search('open') !== -1) {
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

	// WARN: Do onbeforeunload more elegantly?
	window.onbeforeunload = function() {};

});