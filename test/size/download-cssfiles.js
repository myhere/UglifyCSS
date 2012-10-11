#!/usr/bin/env node

var http = require('http'),
    fs = require('fs'),
    os = require('os'),
    path = require('path'),
    URL = require('url');


function getOnlineCss() {
  var cssfiles = path.join(__dirname, 'cssfiles.txt');

  if (fs.existsSync(cssfiles)) {
    var content = fs.readFileSync(cssfiles, 'utf-8'),
        lines = content.split(os.EOL),
        urls = [];

    // get urls
    lines.forEach(function(line) {
      line = line.trim();
      if (line != '') {
        urls.push(line);
      }
    });

    var dir = path.join(__dirname, 'css');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    // downlaod
    urls.forEach(function(url, index) {
      http.get(url, function(res) {
        var chunks = [];

        res.on('data', function(chunk) {
          chunks.push(chunk);
        });

        res.on('end', function() {
          var buf = Buffer.concat(chunks);

          // prefix index in case of conflict
          var pathname = URL.parse(url).pathname || '',
              basename = path.basename(pathname) || '',
              filename = path.join(dir, basename);

          fs.writeFileSync(filename, buf);
        });
      }).on('error', function(err) {
        console.error('error in download file: ' + err.message);
      });
    })
  }
}


getOnlineCss();
