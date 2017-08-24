# Nodemailer plugin for converting external images to email attachments

This plugin will convert external images in your [nodemailer](https://github.com/nodemailer/nodemailer) email to be inline ("CID-referenced") attachments within the email. Inline attachments are useful because they embed the image inside the actual email, so it's viewable even if the user is checking their email without an internet connection.

Local files will not be accessible with html alone. This Nodemailer plugin will take images in your email html in the form:

    <img src="path/to/file.jpg">

and replace it with a CID-referenced attachment that works in all email clients.

## Install

```
yarn add nodemailer-plugin-file2inline
```
or
```
npm install nodemailer-plugin-file2inline --save
```

## Usage

#### 1. Load the `nodemailer-plugin-file2inline` plugin:

```javascript
var file2InlinePlugin = require('nodemailer-plugin-file2inline');
```

#### 2. Attach it as a 'compile' handler for a nodemailer transport object

```javascript
//Without options
nodemailerTransport.use('compile', file2InlinePlugin())

//With options
nodemailerTransport.use('compile', file2InlinePlugin({
	cidPrefix: "prefix_",
	htmlFilePath: "path/relative/to/the/html/file",
	maxWidth: 600
))
```
Options are:
- **cidPrefix**: allows to set CID prefix<sup><a href="#1">1</a></sup> ```{cidPrefix: 'somePrefix_'}```, then all inline images will have prefix in cid, i.e.: `cid:somePrefix_5fe3b631c651bdb1`.
- **htmlFilePath**: path to the folder where the html file is, relative to the current working folder
- **maxWidth**: if this options is set, all images will have the "width" attribute set to the value


## Example

```javascript
var nodemailer = require('nodemailer');
var file2InlinePlugin = require('nodemailer-plugin-file2inline');

let transporter = nodemailer.createTransport({
    sendmail: true,
    newline: 'unix',
});
transporter.use('compile', file2InlinePlugin({cidPrefix: 'somePrefix_'}));
transporter.sendMail({
    from: 'me@example.com',
    to: 'hello@mixmax.com',
    html: '<img src="external/image.png">'
});
```

## Changelog

* 1.0.0 Initial release

## References
<sup id="1">1</sup> It might be useful for reply email processing, example with [MailParser](https://github.com/andris9/mailparser)

```javascript
mp.on("attachment", function(attachment, mail){
    if (!attachment.contentId.includes('somePrefix')) { // process only images attached by user in reply
        // ...
    }
});
```

## License

**MIT**
