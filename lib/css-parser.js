function parseAtRule(stream) {
  debugger;

  var type = stream.readBeforeNext(' ');

  // TODO: canse sensitive?
  if (type === 'import') {
    var url = stream.readBeforeNext(';');
    url = url.trim();

    // skip the ';'
    stream.getChar();

    return [{
      type: 'import',
      rule: [
        url
      ]
    }];
  } else if (type === 'media') {
    var selector = stream.readBeforeNext('{');

    selector = selector.trim();
    // skip the '{';
    stream.getChar();


  } else if (type.test(/keyframes/i)) {
  }
}

function read (stream) {
  var character = stream.getChar();

  var ast = [];
  switch(character) {
    case '@':
      // @import, @media, @keyframe
      ast = parseAtRule(stream);
      break;

    case '/':
      // comment
      break;

    case '{':
      // property
      break;
    
    default:
      // code
  }

  if (stream.feof()) {
    return ast;
  } else {
    return ast.concat(read(stream));
  }
}

function parse(orig_code) {
  var stream = new ReadableStream(orig_code);

  var ast = read(stream);

  return ast;
}


/**
 * make a readable stream
 */
function ReadableStream(str) {
  this.string = str;
  this.cursor = 0;

  this.length = str.length;
}
ReadableStream.prototype.getChar = function() {
  if (this.feof()) {
    return '';
  } else {
    return this.string[this.cursor++];
  }
};
ReadableStream.prototype.feof = function() {
  return this.cursor >= this.length;
}
ReadableStream.prototype.ftell = function() {
  return this.cursor;
}
ReadableStream.prototype.readBeforeNext = function(needle) {
  var str = this.string,
      cursor = this.cursor,
      idx = str.indexOf(needle, cursor);

  if (idx === -1) {
    return '';
  } else {
    var ret = str.substring(cursor, idx);
    this.cursor = idx;

    return ret;
  }
}



exports.parse = parse;


/*

{
  type: 'import',
  value: 'dummy.css'
}

{
  type: 'media',
  name: '(min-width: 768px) and (max-width: 979px)'
  value: [
    {
      type: 'selector',
      name: '.hidden-desktop',
      value: [
        ['display', 'inherit !important'],
      ]
    },
    {
      type: 'selector',
      name: '.hidden-desktop',
      value: [
        ['display', 'inherit !important'],
      ]
    },
  ]
}

{
  type: 'font-face',
  value: [
    {
      type: 'selector',
      value: [
        'font-family', 'myFirstFont',
        'src', 'url('Sansation_Light.ttf'), url('Sansation_Light.eot')'
      ]
    }
  ]
}

{
  type: '-webkit-keyframes',
  name: 'progress-bar-stripes',
  value: [
    {
      type: 'selector',
      name: 'from'
      value: [
        ['background-position', '40px 0']
      ]
    }
  ]
}

{
  type: 'selector',
  name: [
      'section',
      'nav'
    ]
  value: [
    ['background-position', '40px 0']
  ]
}

{
  type: 'comment',
  value: ''
}

*/
