var fs = require("fs");

function replaceFiles(options, html, getCidFunc) {
  return html.replace(/(src=(?:"|')([^"]+?)(?:"|'))|(url\((?:"|')([^'"]+?)(?:"|')\))|(background=(?:"|')([^"]+?)(?:"|'))/g, function(data, fullMatch1, filePath1, fullMatch2, filePath2, fullMatch3, filePath3) {

    let fullMatch = fullMatch1 || fullMatch2 || fullMatch3;
    let filePath = filePath1 || filePath2 || filePath3;

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
    var imageAttrs = [];
    if(fullMatch1){
      imageAttrs.push(`src="cid:${cid}"`) 
    } else if(fullMatch2){
      imageAttrs.push(`url("${cid}")`) 
    } else if (fullMatch3) {
      imageAttrs.push(`background="cid:${cid}"`) 
    }

    if (options.maxWidth) {
      imageAttrs.push('width="'+options.maxWidth+'"');
    }

    return imageAttrs.join(" ");
  });
}

module.exports = replaceFiles;