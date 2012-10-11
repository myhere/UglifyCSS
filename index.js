var sorter = require('./lib/sorter'),
    minfier = require('clean-css');

function compress(code, option) {
  var css = sorter.sort(code);

  css = minfier.process(css, option);

  return css;

}

exports.compress = compress;
