"use strict";

var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");

var _authorize = require("./authorize");

_Object$keys(_authorize).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _authorize[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _authorize[key];
    }
  });
});

var _token = require("./token");

_Object$keys(_token).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _token[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _token[key];
    }
  });
});

var _wellKnown = require("./well-known");

_Object$keys(_wellKnown).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _wellKnown[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _wellKnown[key];
    }
  });
});
//# sourceMappingURL=index.js.map