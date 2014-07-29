function build_min_list(exists_list){
	var files_needed = ['client_polls.js', 'client_poll.js', 'jquery_mobile_1_4_3.js', 'jquery_2_1_1.js', 'combined_style.css'];
	for (entry in files_needed) {
		console.log('Looking for '+entry);

		// inefficient!
		var exists = false;
		if (entry.split(".").slice(-1)[0] === '.js') {
			console.log('Found '+entry);
			exists = fs.existsSync(path.join(__dirname + '/../public/' + '/dist/javascripts/client_polls.js'));
		} else {
			console.log('Did not find '+entry);
		}
		exists_list[entry] = exists;
	}
}