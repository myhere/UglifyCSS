var minifier = require('../../'),
    helper = require('../../lib/helper'),
    cleancss = require('clean-css'),
    fs = require('fs');

// 文件编码转换
var charset = 'utf-8';
// var charset = 'gbk';


// sort + clean
var rawBuf = fs.readFileSync('./fixture/main.css'); 
var newBuf = minifier.compress(rawBuf, {
  charset: charset
});

fs.writeFileSync('./fixture/main.sorted.css', newBuf);



// clean
if (charset == 'gbk') {
  newBuf = helper.iconv('gbk', 'utf-8', rawBuf);
}

var s = newBuf.toString('utf-8');
s = cleancss.process(s);

if (charset == 'gbk') {
  newBuf = helper.iconv('utf-8', 'gbk', s);
}

fs.writeFileSync('./fixture/main.cleaned.css', newBuf);
