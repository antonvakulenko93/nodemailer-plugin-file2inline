var replaceFiles = require('../src/replace');
var path = require("path");

describe('file2inline plugin', function() {
  var getCid = function(filePath) {
    // Make up a fake string to very parameters were passed correctly.
    filePath = path.basename(filePath);
    return filePath.split('.').reverse().join('.');
  };
  var defaultOptions = {
    htmlFilePath: __dirname + "/"
  };

  it('should replace a single source', function() {
    var html = '<img src="image.png">';
    var expected = '<img src="cid:png.image">';
    expect(replaceFiles(defaultOptions, html, getCid)).toBe(expected);
  });

  it('should handle attributes on the HTML tag', function() {
    var html = '<img style="test" src="image.png" width="100%">';
    var expected = '<img style="test" src="cid:png.image" width="100%">';
    expect(replaceFiles(defaultOptions, html, getCid)).toBe(expected);
  });

  it('should replace multiple sources', function() {
    var html = '<img src="image.png"><br><img src="image2.png">';
    var expected = '<img src="cid:png.image"><br><img src="cid:png.image2">';
    expect(replaceFiles(defaultOptions, html, getCid)).toBe(expected);
  });

  it('should not replace already inlined sources', function() {
    var html = '<img src="cid:something">';
    expect(replaceFiles(defaultOptions, html, getCid)).toBe(html);
  });

  it('should not replace remote sources', function() {
    var html = '<img src="https://www.google.com/image.png">';
    expect(replaceFiles(defaultOptions, html, getCid)).toBe(html);
  });

  it('should not touch inline images', function() {
    var html = '<img src="data:image\/png;base64,abc">';
    expect(replaceFiles(defaultOptions, html, getCid)).toBe(html);
  });

  it('should not touch non existing images', function() {
    var html = '<img src="not-an-image.png">';
    expect(replaceFiles(defaultOptions, html, getCid)).toBe(html);
  });
});
