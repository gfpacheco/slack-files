'use strict';

var SLACK_API_ROOT = 'https://slack.com/api';

var request = require('request'),
  async = require('async');

var SlackFiles = function(token, asyncLimit) {
  this.token = token;
  this.asyncLimit = asyncLimit || 10;
};

var filterFiles = function(files, filter) {
  if (!filter) {
    return files;
  }

  if (typeof filter === 'string') {
    var filetypeFilter = filter;
    filter = function(file) {
      return file.filetype === filetypeFilter;
    };
  }

  return files.filter(filter);
};

SlackFiles.prototype.iterate = function(filter, iterator, callback) {
  var self = this;

  var iteratePage = function(page) {
    var path = SLACK_API_ROOT + '/files.list?count=1000&page=' + page + '&token=' + self.token;
    request(path, function(err, res, body) {
      if (err) {
        return callback(err);
      }

      var result = JSON.parse(body);
      var files = filterFiles(result.files, filter);

      async.eachLimit(files, self.asyncLimit, iterator, function(err) {
        if (err) {
          return callback(err);
        }

        if (result.paging.pages === page) {
          callback();
        } else {
          iteratePage(page + 1);
        }
      });
    });
  };

  iteratePage(1);
};

SlackFiles.prototype.count = function(field, callback) {
  var counts = {};

  this.iterate(null, function(file, callback) {
    var fieldValue = file[field];
    counts[fieldValue] = (counts[fieldValue] || 0) + 1;
    callback();
  }, function(err) {
    if (err) {
      return callback(err);
    }

    return callback(null, counts);
  });
};

module.exports = SlackFiles;
