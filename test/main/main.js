var minifier = require('../../'),
    fs = require('fs');

var cssText = fs.readFileSync('./fixture/main.css', 'utf-8');

var s = minifier.compress(cssText);


fs.writeFileSync('./fixture/main.css.ast', s);
