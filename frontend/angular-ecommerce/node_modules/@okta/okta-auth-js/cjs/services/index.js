"use strict";

var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");

var _AutoRenewService = require("./AutoRenewService");

_Object$keys(_AutoRenewService).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _AutoRenewService[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _AutoRenewService[key];
    }
  });
});

var _SyncStorageService = require("./SyncStorageService");

_Object$keys(_SyncStorageService).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _SyncStorageService[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _SyncStorageService[key];
    }
  });
});
//# sourceMappingURL=index.js.map