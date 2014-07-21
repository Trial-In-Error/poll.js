var current_question;

//eval(alert($('#data')[0].innerHTML)); // jshint ignore:line
eval($('#data')[0].innerHTML); // jshint ignore:line

/*for (entry in Object.keys(poll.question_list)) {
	if(poll[String(entry)] !== undefined) {
		alert(entry+': '+poll[entry]);
	}
}*/

//$('#question p').text('This poll has the hash: '+ poll._id);

var tableContent = '';
for (var entry in poll.question_list) {
//	alert(entry);
//	alert(poll['question_list']['body'])

//	if(poll.question_list[String(entry)] !== undefined) {
//		alert(entry+': '+poll.question_list[entry]);
//	}

	tableContent += '<tr>';
	tableContent += '<td>' + String(entry) + '</td>';
	tableContent += '<td>' + poll.question_list[entry].body + '</td>';
	tableContent += '<td>' + poll.question_list[entry]['type'].name + '</td>';
	tableContent += '</tr>';
}

$('#question table tbody').html(tableContent);




//temp += '<form><label><input type = "checkbox" name="checkbox-0">Check me.</label></form>'

/*$('#createButton').bind('click', function() {
    $('#buttonPlaceHolder').append('<a href="#" data-role="button">'+$('#buttonText').val()+'</a>');

    // refresh jQM controls
    $('#home').trigger('create');
});*/

temp = ''
temp += '<fieldset data-role="controlgroup">'
temp += '<legend>Vertical:</legend>'
temp += '<input type="radio" name="radio-choice-v-2" id="radio-choice-v-2a" value="on" checked="checked">'
temp += '<label for="radio-choice-v-2a">One</label>'
temp += '<input type="radio" name="radio-choice-v-2" id="radio-choice-v-2b" value="off">'
temp += '<label for="radio-choice-v-2b">Two</label>'
temp += '<input type="radio" name="radio-choice-v-2" id="radio-choice-v-2c" value="other">'
temp += '<label for="radio-choice-v-2c">Three</label>'
temp += '</fieldset>'
temp += '</form>'

//<form>
//    <label>
//        <input type="checkbox" name="checkbox-0 ">Check me
//    </label>
//</form>

$('#form').html(temp);
$('#form').trigger('create');

//$("#radio-choice-v-2a").button().refresh();
//$("#radio-choice-v-2b").button().refresh();
//$("#radio-choice-v-2c").button().refresh();

/*if (poll.question_list[current_question].type.name === "pick_n") {
	// For each answer, draw a button
	for (entry in poll.question_list[current_question].type.response_list) {
		// Create a button to click!
		// If N > 1, use check boxes, else use radio buttons
		if (poll.question_list[current_question].type.n === 1)
		{
			// Draw radio buttons
		} else {
			// Draw check boxes
		}
			// The text should be = entry.body
			// It should update entry.answers <---this happens in DOM ready
			// It should check entry.*_explainable when rendering
	}
	// Render a 'back' button
	// Render a 'next' button
	// Check to see if you should render a 'skip' button
}*/