var fs = require("fs");
var crypto = require('crypto');
var replaceFiles = require(__dirname + "/replace");

function getCid(options, attachments) {
  return function(filePath) {
    if (attachments[filePath]) {
      return attachments[filePath].cid;
    }

    var randomCid = (options.cidPrefix || '') + crypto.randomBytes(8).toString('hex');

    attachments[filePath] = {
      cid: randomCid,
      path: filePath,
      contentDisposition: 'inline'
    };
    
    return randomCid;
  };
}

var plugin = function(options) {
  options = options || {};
  return function(mail, done) {
    if (!mail || !mail.data || !mail.data.html) {
      return done();
    }

    mail.resolveContent(mail.data, 'html', function(err, html) {
      if (err) {
        return done(err);
      }

      if (typeof html != "string") {
        html = html.toString();
      }

      var attachments = {};
      html = replaceFiles(options, html, getCid(options, attachments));

      mail.data.html = html;
      if (!mail.data.attachments) {
        mail.data.attachments = [];
      }

      Object.keys(attachments).forEach(function(key) {
        mail.data.attachments.push(attachments[key]);
      });

      done();
    });
  };
};

module.exports = plugin;
