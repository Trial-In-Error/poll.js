// This file holds the string resources used for localization by the server.
// It also contains a bit of glue to do printf style formatting on strings.
// This makes it versatile because the strings can have wildcards in the form
// {0} -> argument 0, {1} -> argument 1, etc.
var stringResources = function(language, string) {
	var args = Array.prototype.slice.call(arguments);
		format = function(format) {
			var args = Array.prototype.slice.call(arguments, 1);
			return format.replace(/{(\d+)}/g, function(match, number) { 
				return args[number] || match;
			});
		};

	var internal = {
		'english':
		{
			'usernameNotFound': 'Username `{0}` not found.',
			'badPassword': 'Incorrect password.',
			'pollTitle': 'Poll: {0}',
			'metaLoginTitle': 'Login',
			'createPollTitle': 'Create',
			'errorTitle': 'Error',
			'exportPollTitle': 'Export',
			'importPollTitle': 'Import',
			'inspectPollTitle': 'Inspect',
			'nicknameLoginTitle': 'Login',
			'pollGridTitle': 'Grid',
			'pollNotFound': 'Poll not found.',
			'pollIndexTitle': 'opiner',
			'registerTitle': 'Register',
			'loginTitle': 'Login',
			'suffix': '{0} - opiner'
		},
		'swedish':
		{
			'pollTitle': 'Poll' //???
		}
	}
	return format.apply({}, [internal[language][string]].concat(args.slice(2)));
};

module.exports = stringResources;