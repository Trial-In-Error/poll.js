var fs = require('fs');
var path = require('path');

/***
* This function builds a list of files that might be minified,
* and then stores whether or not the minified version exists.
* This is used by the server to determine where to serve files
* from. When you add a new javascript file, please add it to
* files_needed.
***/
module.exports = {
	build: function build_min_list(exists_list) {
		// Files are found in /public/javascripts/ and are listed here alphabetically
		var files_needed = [
			// Javascript files
			'clientCreatePoll.js',
			'clientExportPoll.js',
			'clientGridPanel.js',
			'clientGridListPanel.js',
			'clientImportPoll.js',
			'clientLogin.js',
			'clientMetaLogin.js',
			'clientPoll.js',
			'clientPollGrid.js',
			'clientPollGridList.js',
			'clientPollOverview.js',
			'clientPolls.js',
			'clientRegister.js',
			'clientViewPoll.js',
			//'detector.js', // not included in min_list because it's currently not used anywhere
			//'isotope.min.js', // not included in min_list because it's already minified
			'jquery_2_1_1.js',
			'jquery_mobile_1_4_3.js',
			//'masonry.pkgd.min.js', // not included in min_list because it's already minified
			//'packery-mode.pkgd.min.js', // not included in min_list because it's already minified
			'prettyprint.js',
			'spin.js'

			// CSS files
			'combined_style.css'
		];

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