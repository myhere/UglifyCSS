

function uglify(orig_code, options){
  options || (options = {});
  
  var parser = new uglify.Parser({
        starHack: true,
        underscoreHack: true,
        ieFilters: true,
        strict: true
      }),
      sorter = uglify.sorter,
      generator = uglify.generator;


  var ast = parser.parse(orig_code, options),
      ast = sorter.sort(ast, options.order),
      final_code = generator.generate(ast, options);

  return final_code;
};

uglify.Parser = require('./lib/css-parser');
uglify.sorter = require('./lib/property-sorter');
uglify.generator = require('./lib/generator');

module.exports = uglify;
