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

var getError = function(err, body) {
  if (err) {
    return err;
  }

  var result = JSON.parse(body);

  if (!result.ok) {
    return new Error('Slack API returned error:\n' + body);
  } else {
    return null;
  }
};

SlackFiles.prototype.iterate = function(filter, iterator, callback) {
  var self = this,
    iterated = [];

  var iteratePage = function(page) {
    var path = SLACK_API_ROOT + '/files.list?count=1000&page=' + page + '&token=' + self.token;
    request(path, function(err, res, body) {
      err = getError(err, body);
      if (err) {
        return callback(err);
      }

      var result = JSON.parse(body);
      var files = filterFiles(result.files, filter);

      async.mapLimit(files, self.asyncLimit, iterator, function(err, pageIterated) {
        if (err) {
          return callback(err);
        }

        iterated = iterated.concat(pageIterated);

        if (result.paging.pages === page) {
          callback(null, iterated);
        } else {
          iteratePage(page + 1);
        }
      });
    });
  };

  iteratePage(1);
};

SlackFiles.prototype.count = function(field, filter, callback) {
  var counts = {};

  this.iterate(filter, function(file, callback) {
    var fieldValue = file[field];
    counts[fieldValue] = (counts[fieldValue] || 0) + 1;
    callback();
  }, function(err) {
    return callback(err, counts);
  });
};

SlackFiles.prototype.delete = function (filter, callback) {
  var self = this;

  this.iterate(filter, function(file, callback) {
    var path = SLACK_API_ROOT + '/files.delete?file=' + file.id + '&token=' + self.token;
    request(path, function(err, res, body) {
      callback(getError(err, body), file.id);
    });
  }, callback);
};

module.exports = SlackFiles;
