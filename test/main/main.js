var minifier = require('../../'),
    helper = require('../../lib/helper'),
    cleancss = require('clean-css'),
    fs = require('fs');

var charset = 'utf-8';
// var charset = 'gbk';

var cssText = fs.readFileSync('./fixture/main.css'); 

var s = minifier.compress(cssText, {
  charset: charset
});


fs.writeFileSync('./fixture/main.sorted.css', s);



// 压缩一遍


if (charset == 'gbk') {
  cssText = helper.iconv('gbk', 'utf-8', cssText);
}

cssText = cssText.toString('utf-8');
var s = cleancss.process(cssText);

if (charset == 'gbk') {
  s = helper.iconv('utf-8', 'gbk', s);
}

fs.writeFileSync('./fixture/main.cleaned.css', s);
