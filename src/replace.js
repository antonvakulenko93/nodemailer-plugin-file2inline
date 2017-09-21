var fs = require("fs");

function replaceFiles(options, html, getCidFunc) {
  return html.replace(/src=(?:"|')([^"]+?)(?:"|')/g, function(fullMatch, filePath) {
    var unwantedPrefixes = ["data:", "cid:", "http:", "https:"];
    for (var i = 0, len = unwantedPrefixes.length; i < len; i++) {
      if (filePath.indexOf(unwantedPrefixes[i]) === 0) {
        return fullMatch;
      }
    }

    filePath = options.htmlFilePath + filePath;
    if (!fs.existsSync(filePath)) {
      console.error("File "+filePath+" doesn't exists - it was not attached");
      return fullMatch;
    }

    var cid = getCidFunc(filePath);

    var imageAttrs = ['src="cid:' + cid +'"'];
    if (options.maxWidth) {
      imageAttrs.push('width="'+options.maxWidth+'"');
    }

    return imageAttrs.join(" ");
  });
}

module.exports = replaceFiles;