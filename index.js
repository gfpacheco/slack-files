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

switch (command) {
  case 'count':
    slackFiles.count(userArgs[2] || 'filetype', printResult);
    break;
  default:
    console.log('Command not found: ' + command);
}
