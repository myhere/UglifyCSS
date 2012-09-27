var parserlib = require('./vendor/node-parserlib.js');


// overwrite fire event to get all the ast
var oldFire = parserlib.util.EventTarget.prototype.fire;
var arr = [];
parserlib.util.EventTarget.prototype.fire = function(event) {
  arr.push(event);
  oldFire.apply(this, arguments);
}

// overwrite parse method
var oldParse = parserlib.css.Parser.prototype.parse;
parserlib.css.Parser.prototype.parse = function(input) {
  oldParse.apply(this, arguments);

  return arr;
}

// 
module.exports = exports = parserlib.css.Parser;
