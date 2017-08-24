var fs = require("fs");
var crypto = require('crypto');

function replaceFiles(options, html, getCidFunc) {
  return html.replace(/src=(?:"|')([^"]+?)(?:"|')/g, function(fullMatch, filePath) {
    var unwantedPrefixes = ["data:", "cid:", "http:", "https:"];
    for (var i = 0, len = unwantedPrefixes.length; i < len; i++) {
      if (filePath.indexOf(unwantedPrefixes[i]) === 0) {
        return fullMatch;
      }
    }

    filePath = options.htmlFilePath + filePath;

    var cid = getCidFunc(filePath);

    var imageAttrs = ['src="cid:' + cid +'"'];
    if (options.maxWidth) {
      imageAttrs.push('width="'+options.maxWidth+'"');
    }

    return imageAttrs.join(" ");
  });
}

function getCid(options, attachments) {
  return function(filePath) {
    if (attachments[filePath]) {
      return attachments[filePath].cid;
    }

    attachments[filePath] = {
      cid: cid,
      path: filePath,
      contentDisposition: 'inline'
    };

    var randomCid = (options.cidPrefix || '') + crypto.randomBytes(8).toString('hex');
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
