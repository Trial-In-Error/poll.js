//var current_question;
//var JSON = require('JSON');
//$('#question p').text('Fuck off 2.');

//var poll = $("#data")[0].innerHTML;
//var temp = JSON.parse($("#data").html());
//var temp = document.getElementById('data');
eval(alert($("#data")[0].innerHTML));
//eval($("#data")[0].innerHTML);

/*for (entry in Object.keys(poll.question_list)) {
	if(poll[String(entry)] !== undefined) {
		alert(entry+": "+poll[entry]);
	}
}*/

//alert(Object.keys(poll[0]))


//alert(Object.keys(document.getElementById('data')));
//var poll = JSON.parse($("#data").html());

//alert(poll.question_list[0])

$('#question p').text('This poll has the hash: '+ poll._id);
var tableContent = '';
for (entry in poll.question_list) {
	//alert(entry);
	//alert(poll["question_list"]["body"])
	if(poll["question_list"][String(entry)] !== undefined) {
		alert(entry+": "+poll["question_list"][entry]);
	}
	tableContent += '<tr>';
	tableContent += '<td>' + String(entry) + '</td>';
	tableContent += '<td>' + poll["question_list"][entry]["body"] + '</td>';
	tableContent += '<td>' + poll["question_list"][entry]["type"]["name"] + '</td>';
	tableContent += '</tr>';
};
$('#question table tbody').html(tableContent);