// Fill table with data
function populateTable() {
	// Empty content string
	var tableContent = '';
	// jQuery AJAX call for JSON
	$.getJSON( '/pollroute/exportpolljson/'+window.location.href.split('/').pop(), function( data ) {
		// Inject the whole content string into our existing HTML table
		if(data.msg === null) {
			$('#pollname h3').text('Error!');
			$('#polljson').html('<p>Poll with id: '+ window.location.href.split('/').pop()+' not found!</p>');
			$('#refreshbutton').hide();
			$('#savebutton').hide();
			$('#clonebutton').hide();
		} else {
			$('#pollname h3').text(data.msg.name);
			$('#polljson pre').text(JSON.stringify(data.msg, null, 4));
		}

		//$('#polljson').trigger('create');
	});
}

// DOM Ready =============================================================
$(document).ready(function() {
	// Populate the user table on initial page load
	populateTable();
});