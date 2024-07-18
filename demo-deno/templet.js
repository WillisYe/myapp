// deno run -A templet.js

var _templateSettings = {
  evaluate: /{%([\s\S]+?)%}/g,
  interpolate: /{%=([\s\S]+?)%}/g,
  saveRegex: /\{(\$|-|=|\?)(\w+)\}/g
};
var replaceWith = function (template, obj) {
  return template.replace(/%7B/gi, '{')
    .replace(/%7D/gi, '}')
    .replace(_templateSettings.saveRegex, function (o, k, v) {
      if (k == '$' && v in obj)
        return encodeHTML(obj[v]);
      if (k == '=')
        return obj[v] == null ? '' : obj[v];
      if (k == '-')
        return '{=' + v + '}';
      return o;
    });
};

var templet = function () {
  var self = this;
  var args = arguments,
    _this = this;
  if (args.length == 2) {
    if (Array.isArray(args[1])) {
      var result = [];
      for (var i = 0, len = args[1].length; i < len; i++) {
        args[1][i]._currentIndex = i;
        result.push(templet.call(_this, args[0], args[1][i]));
      }
      return result.join('');
    } else {
      if (typeof args[0] !== 'string') {
        throw new Error('template error');
      }
      if (typeof args[1] !== 'object') {
        console.log(typeof args[1])
        console.log(JSON.stringify(args[1], null, 2))
        throw new Error('template data is not an object');
      }
      var c = _templateSettings;
      var str = replaceWith(args[0], args[1]);
      var tmpl = 'var __p=[],print=function(){__p.push.apply(__p,arguments);};' + 'with(obj||{}){__p.push(\'' + str.replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(c.interpolate, function (match, code) {
          return "'," + code.replace(/\\'/g, "'") + ",'";
        })
        .replace(c.evaluate || null, function (match, code) {
          return "');" + code.replace(/\\'/g, "'").replace(/[\r\n\t]/g, ' ') + "__p.push('";
        })
        .replace(/\r/g, '\\r')
        .replace(/\n/g, '\\n')
        .replace(/\t/g, '\\t') + "');}return __p.join('');";

      var func = new Function('obj', tmpl);
      return func(args[1]);
    }
  } else if (args.length > 2) {
    var result = templet(args[0], args[1]);
    for (var i = 2, len = args.length; i < len; i++) {
      result = templet(result, args[i]);
    }
    return result;
  } else {
    return args[0];
  }
};


// 测试用例
var template = '<div>{%= name %}</div>';
var data = { name: 'CursorBot' };

// 测试传入模板和数据对象的情况
console.log(templet(template, data)); // 期望输出：<div>CursorBot</div>

// 测试传入模板和数组的情况
var template2 = '{% for(var i=0; i<users.length; i++) { %}<div>{%= users[i].name %}</div>{% } %}';
var data2 = { users: [{ name: 'Alice' }, { name: 'Bob' }] };
console.log(templet(template2, data2)); // 期望输出：<div>Alice</div><div>Bob</div>

// // 测试传入多个参数的情况
var template3 = '<div>{%= name %}</div><span>{%= age %}</span>';
console.log(templet(template3, data)); // 期望输出：<div>CursorBot</div><span>25</span>

// 测试传入单个参数的情况
console.log(templet('Hello, World!')); // 期望输出：Hello, World!