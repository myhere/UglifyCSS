var util = require('util');

function parse(orig_code, option) {
  var parser = new CssParser(orig_code);

  parser.parse();

  return parser.getAst();

}


function CssParser(text) {
  this._stringReader = new StringReader(text);

  this._ast = [];
}
CssParser.prototype = {
  constructor: CssParser,

  parse: function() {
    var c = this._stringReader.getChar();
    switch(c) {
      case '@':
        this.parseAtRule();
        break;
      case '/':
        // code
        break;
      case '{':
        // code
        break;
      case '@':
        // code
        break;
    }
  },

  parseAtRule: function() {
    var text = this._stringReader.peek(/^[-a-z]+/i);
    if (text === 'import') {
    } else if (text === 'media') {
    } else if (text === 'keyframes') {
    } else if (/keyframes$/i.test('keyframes')) {
    }
  },

  getAtRuleType: function() {
  },

  getAst: function() {
    return this._ast;
  }
};


function StringReader(str) {
  str = str.replace(/\n\r?/g, '\n');

  this._string = str;
  this._cursor = 0;
  this._length = str.length;
}
StringReader.prototype = {
  constructor: StringReader,

  feof: function() {
    return this._cursor > this._length;
  },

  /**
   * @param cond {Regexp}
   * @return the string that match cond
   */
  peek: function(cond) {
    if (util.isRegExp(cond)) {
      var s = this._string.substring(this._cursor),
          matched = s.match(cond);

      if (matched) {
        return matched[0];
      } else {
        return null;
      }
    } else {
      return null;
    }
  },

  getChar: function() {
    if (this.feof()) {
      return null;
    } else {
      return this._string[this._cursor++];
    }
  },

  /**
   * @param len {Number} >0
   */
  read: function(len) {
    var from = this._cursor,
        to;

    this._cursor = Math.min(this._cursor + len, this._length);
    to = this._cursor;

    return this._string.substr(from, to);
  }
};


exports.parse = parse;


var ast = [
  {
    type: 'import',
    prefix: '@import "dummy.css"'
  },
  {
    type: 'media',
    prefix: '@media (min-width: 768px) and (max-width: 979px)',
    rules: [
      {
        selector: '.hidden-desktop',
        style: [
          ['display', 'inherit !important']
        ]
      }
    ]
  }, 
  {
    type: 'keyframes',
    prefix: '@-webkit-keyframes progress-bar-stripes',
    rules: [
      {
        framename: 'from',
        style: [
          ['background-position', '40px 0']
        ]
      }
    ]
  },
  {
    selector: 'body',
    style: [
      ['margin', '0'],
      ['padding', '0']
    ]
  }
];
