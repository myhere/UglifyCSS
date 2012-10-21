var CSSOM = require('cssom');


function addSorterBehavior() {
  // modify getter of CSSOM.CSSStyleDeclaration.prototype 
  var proto = CSSOM.CSSStyleDeclaration.prototype,
      cssText = proto.__lookupGetter__('cssText');


  // TODO:
  // keep the order of shorthand property and its individual properties
  function bubbleSort(keys) {
    for (var i = 0, len = keys.length; i < len; ++i) {
      for (var j = i + 1; j < len; ++j) {
        var k1 = keys[i],
            k2 = keys[j];

        if (k1 !== k2) {
          var k1_info = parsePropertyName(k1),
              k2_info = parsePropertyName(k2);

          var k1_p = k1_info.propertyName,
              k2_p = k2_info.propertyName;

          if (k1_p > k2_p) {
            var tmp = k1;
            keys[i] = k2;
            keys[j] = tmp;
          }
        }
      }
    }

    return keys;
  }

  function parsePropertyName(key) {
    var hackPrefix = [
        '-webkit-',
        '-moz-',
        '-ms-',
        '-o-',
        '-',
        '*',
        '_',
      ],
      notAllowed = [
      ];

    var hack = '';
    hackPrefix.forEach(function(prefix) {
      if (key.indexOf(prefix) === 0) {
        hack = prefix;
        return;
      }
    });

    return {
      hackPrefix: hack,
      propertyName: key.substr(hack.length)
    };
  }

  proto.__defineGetter__("cssText", function() {
    var keys = [];
    for (var i=0, length=this.length; i < length; ++i) {
      keys.push(this[i]);
    }

    // cause Array.sort is not stable in V8
    // @see: http://code.google.com/p/v8/issues/detail?id=90#makechanges
    keys = bubbleSort(keys);

    for (var i=0, length=this.length; i < length; ++i) {
      this[i] = keys[i];
    }

    return cssText.apply(this, arguments);
  });
}

function sort(orig_code) {
  var om =  CSSOM.parse(orig_code);

  om = uncircularOwnProperties(om);

  return om.toString();
}


/**
 * @param {Object} object
 * @return {Object}
 */
function uncircularOwnProperties(object) {
  function _uncircular(object, depth, stack) {
    var stackLength = stack.push(object);
    depth++;
    var keys = Object.keys(object);
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = object[key];
      if (value && typeof value === 'object') {
        var level = stack.indexOf(value);
        if (level !== -1) {
          object[key] = buildPath(depth - level - 1);
        } else {
          _uncircular(value, depth, stack);
          stack.length = stackLength;
        }
      }
    }
  }
  _uncircular(object, 0, []);
  return object;
}

/**
 * buildPath(2) -> '../..'
 * @param {number} level
 * @return {string}
 */
function buildPath(level) {
  if (level === 0) {
    return '.';
  } else {
    var result = '..';
    for (var i = 1; i < level; i++) {
      result += '/..';
    }
    return result;
  }
}


addSorterBehavior();

exports.sort = sort;
