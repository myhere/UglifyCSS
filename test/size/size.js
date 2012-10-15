#!/usr/bin/env node

var cleancss = require('clean-css'),
    iconvLite = require('iconv-lite'),
    Table = require('cli-table'),
    uglifycss = require('../../'),
    fs = require('fs'),
    zlib = require('zlib');

function Processor(buffer, encoding) {
  encoding || (encoding = 'utf-8');

  this._encoding = encoding;
  this._buffer = buffer;
  this._text = iconvLite.decode(buffer, encoding);
}
Processor.prototype = {
  constructor: Processor,

  clean: function() {
    var tmp = cleancss.process(this._text);
    
    return iconvLite.encode(tmp, this._encoding);
  },

  sort: function() {
    var tmp = uglifycss.compress(this._text);

    return iconvLite.encode(tmp, this._encoding);
  }
}
function gzip(buffer, cb) {
  zlib.gzip(buffer, function(error, result) {
    if (error) {
      throw error;
    } else {
      cb(result)
    }
  });
}

var files = fs.readdirSync('./css');
files
.filter(function(file) {
  file = './css/' + file;
  var stat = fs.statSync(file);

  return stat.isFile();
})
.forEach(function(file) {
  file = './css/' + file;
  var buf = fs.readFileSync(file);

  var processor = new Processor(buf);

  var cleaned = processor.clean(),
      sorted = processor.sort();

  gzip(cleaned, function(result) {
    save(file, 'cleaned', cleaned, result);
  });

  gzip(sorted, function(result) {
    save(file, 'sorted', sorted, result);
  });
});


function save(file, type, raw, gziped) {
  var obj = save.obj;
  if (!obj) {
    obj = save.obj = {};
  }

  var fileInfo = obj[file];
  if (!fileInfo) {
    fileInfo = obj[file] = {};
  }

  fileInfo[type] = [raw.length, gziped.length];

  if (!save.counter) {
    save.counter = 0;
  }
  save.counter += 1;

  if (save.counter >= files.length * 2) {
    report(obj);
  }
}


function report(obj) {
  var table = new Table({
    head: [
      'file',
      'cleancss',
      'sort',
      'save'
    ],
    colWidths: [30, 10, 10, 10]
  });

  function calc(a, b) {
    return ((1 - a / b) * 100).toFixed(2) + '%';
  }

  for (var p in obj) {
    table.push([
        p,
        obj[p].cleaned[0],
        obj[p].sorted[0],
        calc(obj[p].sorted[0], obj[p].cleaned[0])
        ]);
    table.push([
        p + '(gziped)',
        obj[p].cleaned[1],
        obj[p].sorted[1],
        calc(obj[p].sorted[1], obj[p].cleaned[1])
        ]);
  }

  console.log(table.toString());
}
