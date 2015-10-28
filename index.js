#! /usr/bin/env node

var userArgs = process.argv.slice(2);

if (userArgs.length < 2) {
  return console.log('Usage:\nslack-files API_TOKEN COMMAND');
}

var token = userArgs[0],
  command = userArgs[1],
  SlackFiles = require('./slack-files'),
  slackFiles = new SlackFiles(token);

var printResult = function(err, result) {
  if (err) {
    return console.error(err);
  }

  console.log(JSON.stringify(result, null, '  '));
};

var count = function() {
  slackFiles.count(userArgs[2] || 'filetype', printResult);
};

var del = function() {
  var filter = null;
  if (userArgs.length >= 3) {
    var criteriaPartials = userArgs[2].split('='),
      field = criteriaPartials[0],
      value = criteriaPartials.slice(1).join('=');

    filter = function(file) {
      return file[field] == value; // 1 should be equal to '1'
    };
  }

  slackFiles.delete(filter, printResult);
};

switch (command) {
  case 'count':
    count();
    break;
  case 'delete':
    del();
    break;
  default:
    console.log('Command not found: ' + command);
}
