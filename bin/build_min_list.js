var fs = require('fs');
var path = require('path');

module.exports = {
	build: function build_min_list(exists_list) {
		var files_needed = ['clientPolls.js',
							'clientPoll.js',
							'jquery_mobile_1_4_3.js',
							'jquery_2_1_1.js',
							'combined_style.css',
							'clientLogin.js',
							'prettyPrint.js',
							'clientExportPoll.js',
							'clientViewPoll.js',
							'clientMetaLogin.js',
							'clientImportPoll.js',
							'clientRegister.js'];

		console.log('Looking from: '+String(__dirname));

		for (var entry in files_needed) {
			//console.log('Looking for '+files_needed[entry]);

			//WARN: inefficient!
			var exists = false;

			//console.log(files_needed[entry].split('.').slice(-1)[0]);
			if (files_needed[entry].split('.').slice(-1)[0] === 'js') {
				//console.log('Looked for '+String(path.join(__dirname + '/../public/dist/javascripts/'+files_needed[entry])));
				exists = fs.existsSync(path.join(__dirname + '/../public/dist/javascripts/'+files_needed[entry]));
				/*if(exists) {
					console.log('Found it!');
				} else {
					console.log('Didn\'t find it!');
				}*/
			} else if (files_needed[entry].split('.').slice(-1)[0] === 'css') {
				//console.log('Looked for '+String(path.join(__dirname + '/../public/dist/javascripts/'+files_needed[entry])));
				exists = fs.existsSync(path.join(__dirname + '/../public/dist/stylesheets/'+files_needed[entry]));
				/*if(exists) {
					console.log('Found it!');
				} else {
					console.log('Didn\'t find it!');
				}*/
			}else {
				//console.log('Cannot find '+files_needed[entry] + ' because the extension .'+ files_needed[entry].split('.').slice(-1)[0] + ' is not known.');
			}
			exists_list[files_needed[entry]] = exists;
		}
		return exists_list;
	}
};