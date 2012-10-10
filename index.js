var CSSOM = require('cssom');

addSorter();

function addSorter() {
  // modify getter of CSSOM.CSSStyleDeclaration.prototype 
  var proto = CSSOM.CSSStyleDeclaration.prototype,
      cssText = proto.__lookupGetter__('cssText');


  function sort(keys) {
    for (var i = 0, len = keys.length; i < len; ++i) {
      for (var j = i + 1; j < len; ++j) {
        var k1 = keys[i],
            k2 = keys[j];

        if (k1 !== k2) {
          var k1_info = parsePropertyName(k1),
              k2_info = parsePropertyName(k2);

          /**
           *   width
           *  *width
           *  -width
           */

          if (k1_info.hackPrefix || k2_info.hackPrefix) {
          } else {
            if (k1 > k2) {
              var tmp = k1;
              keys[i] = k2;
              keys[j] = tmp;
            }
          }
        }

      }
    }

    return keys;
  }

  function sortCb(k1, k2) {
    if (k1 !== k2) {
      var k1_info = parsePropertyName(k1),
          k2_info = parsePropertyName(k2);

      /**
       *   width
       *  *width
       *  -width
       */

      if (k1_info.hackPrefix || k2_info.hackPrefix) {
      } else {
        return k1 > k2 ? 1 : -1;
      }
    } else {
      return 0;
    }
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
    debugger;

    var keys = [];
    for (var i=0, length=this.length; i < length; ++i) {
      keys.push(this[i]);
    }

    keys = sort(keys);
    // keys.sort(sortCb);

    for (var i=0, length=this.length; i < length; ++i) {
      this[i] = keys[i];
    }

    return cssText.apply(this, arguments);
  });
}

function parse(orig_code) {
  var css =  CSSOM.parse(orig_code);

  return uncircularOwnProperties(css);
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


module.exports = parse;
