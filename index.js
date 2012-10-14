var sorter = require('./lib/sorter'),
    helper = require('./lib/helper'),
    minfier = require('clean-css');

/**
 * @param code {Buffer|String}
 * @param option {Object}
 *         - removeEmpty cleancss's setting
 *         - charset default 'utf-8'
 *
 * @return {Buffer} option.charset encoded buffer
 */
function compress(code, option) {
  var defaultEncoding = 'utf-8';
  option || (option = {});
  option.charset || (option.charset = defaultEncoding);

  var buf = helper.iconv(option.charset, defaultEncoding, code);
  code = buf.toString(defaultEncoding);


  var css = sorter.sort(code);

  if (!option.debug) {
    css = minfier.process(css, option);
  }

  var newBuf = helper.iconv(defaultEncoding, option.charset, css);

  return newBuf;
}

exports.compress = compress;
