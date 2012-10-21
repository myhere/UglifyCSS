# UglifyCSS

Yet another css minifier(compressor). CSS properties are sorted for better
gzip compress. After sorted, the file is about 1%~2% smaller with gzip.

For size comprare: see [size.js](https://github.com/myhere/UglifyCSS/blob/master/test/size/size.js)

## Usage

```js
var minifier = require('../../');

// method
/**
 * @param buf {Buffer|String}
 * @param option {Object} optional 
 *         - charset: {String} default to utf-8
 *         - debug: {Boolean} when true only sort css property
 *
 * @return {Buffer} option.charset encoded buffer
 */
minifier.compress(buf, option);
```


## TODO
 * keep the order of shorthand property and its individual properties

