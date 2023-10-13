"use strict";

var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");

var _headers = require("./headers");

_Object$keys(_headers).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _headers[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _headers[key];
    }
  });
});

var _request = require("./request");

_Object$keys(_request).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _request[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _request[key];
    }
  });
});
//# sourceMappingURL=index.js.map