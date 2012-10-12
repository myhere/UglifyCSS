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
var newBuf = helper.iconv(charset, 'utf-8', rawBuf);

var s = newBuf.toString('utf-8');
s = cleancss.process(s);

newBuf = helper.iconv('utf-8', charset, s);


fs.writeFileSync('./fixture/main.cleaned.css', newBuf);
