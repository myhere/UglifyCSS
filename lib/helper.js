var iconvLite = require('iconv-lite');

module.exports = {
  /**
   * 将 buffer 从 inCharset 转为 outCharset
   *
   * @param inCharset  {String}
   * @param outCharset {String}
   * @param buffer {String|Buffer} 如果是 String, 则必须是 inCharset 编码的
   *
   * @return {Buffer}
   * 
   */
  iconv: function(inCharset, outCharset, buffer) {
    if (!Buffer.isBuffer(buffer)) {
        buffer = new Buffer(buffer, inCharset);
    }

    var str = iconvLite.decode(buffer, inCharset);

    return iconvLite.encode(str, outCharset);
  }
};
