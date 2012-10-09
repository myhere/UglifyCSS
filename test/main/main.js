var uglify = require('../../'),
    fs = require('fs');

var cssText = fs.readFileSync('./fixture/main.css', 'utf-8');

var ast;
try {
  ast = uglify(cssText);
} catch(e) {
  console.log(e.message);
}

var s = JSON.stringify(ast, null, 2);

fs.writeFileSync('./fixture/main.css.ast', s);

