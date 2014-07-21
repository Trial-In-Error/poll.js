var current_question;

//eval(alert($('#data')[0].innerHTML)); // jshint ignore:line
eval($('#data')[0].innerHTML); // jshint ignore:line

/*for (entry in Object.keys(poll.question_list)) {
	if(poll[String(entry)] !== undefined) {
		alert(entry+': '+poll[entry]);
	}
}*/

$('#question p').text('This poll has the hash: '+ poll._id);

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
	tableContent += '<td>' + poll.question_list[entry].type.name + '</td>';
	tableContent += '</tr>';
}

$('#question table tbody').html(tableContent);