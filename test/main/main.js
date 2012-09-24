
var uglify = require('../../'),
    fs = require('fs');

var cssText = fs.readFileSync('./main.css');

uglify(cssText);
