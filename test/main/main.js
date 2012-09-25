
var uglify = require('../../'),
    fs = require('fs');

var cssText = fs.readFileSync('./main.css', 'utf-8');

uglify(cssText);
