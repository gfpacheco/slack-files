#! /usr/bin/env node

var userArgs = require('minimist')(process.argv.slice(2));

if (userArgs._.length < 2) {
  return console.log('Usage:\nslack-files API_TOKEN COMMAND');
}

var token = userArgs._[0],
  command = userArgs._[1],
  SlackFiles = require('./slack-files'),
  slackFiles = new SlackFiles(token);

var printResult = function(err, result) {
  if (err) {
    return console.error(err);
  }

  console.log(JSON.stringify(result, null, '  '));
};

var getFilter = function() {
  if (userArgs.filter) {
    var criteriaPartials = userArgs.filter.split('='),
      field = criteriaPartials[0],
      value = criteriaPartials.slice(1).join('=');

    return function(file) {
      return file[field] == value; // 1 should be equal to '1'
    };
  }
};

var count = function() {
  slackFiles.count(userArgs._[2] || 'filetype', printResult);
};

var del = function() {
  slackFiles.delete(getFilter(), printResult);
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
