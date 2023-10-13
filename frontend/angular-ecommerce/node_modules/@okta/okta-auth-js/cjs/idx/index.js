"use strict";

var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");

var _exportNames = {
  authenticate: true,
  cancel: true,
  handleEmailVerifyCallback: true,
  isEmailVerifyCallback: true,
  parseEmailVerifyCallback: true,
  isEmailVerifyCallbackError: true,
  interact: true,
  introspect: true,
  poll: true,
  proceed: true,
  canProceed: true,
  register: true,
  recoverPassword: true,
  handleInteractionCodeRedirect: true,
  startTransaction: true,
  unlockAccount: true
};
Object.defineProperty(exports, "authenticate", {
  enumerable: true,
  get: function () {
    return _authenticate.authenticate;
  }
});
Object.defineProperty(exports, "cancel", {
  enumerable: true,
  get: function () {
    return _cancel.cancel;
  }
});
Object.defineProperty(exports, "handleEmailVerifyCallback", {
  enumerable: true,
  get: function () {
    return _emailVerify.handleEmailVerifyCallback;
  }
});
Object.defineProperty(exports, "isEmailVerifyCallback", {
  enumerable: true,
  get: function () {
    return _emailVerify.isEmailVerifyCallback;
  }
});
Object.defineProperty(exports, "parseEmailVerifyCallback", {
  enumerable: true,
  get: function () {
    return _emailVerify.parseEmailVerifyCallback;
  }
});
Object.defineProperty(exports, "isEmailVerifyCallbackError", {
  enumerable: true,
  get: function () {
    return _emailVerify.isEmailVerifyCallbackError;
  }
});
Object.defineProperty(exports, "interact", {
  enumerable: true,
  get: function () {
    return _interact.interact;
  }
});
Object.defineProperty(exports, "introspect", {
  enumerable: true,
  get: function () {
    return _introspect.introspect;
  }
});
Object.defineProperty(exports, "poll", {
  enumerable: true,
  get: function () {
    return _poll.poll;
  }
});
Object.defineProperty(exports, "proceed", {
  enumerable: true,
  get: function () {
    return _proceed.proceed;
  }
});
Object.defineProperty(exports, "canProceed", {
  enumerable: true,
  get: function () {
    return _proceed.canProceed;
  }
});
Object.defineProperty(exports, "register", {
  enumerable: true,
  get: function () {
    return _register.register;
  }
});
Object.defineProperty(exports, "recoverPassword", {
  enumerable: true,
  get: function () {
    return _recoverPassword.recoverPassword;
  }
});
Object.defineProperty(exports, "handleInteractionCodeRedirect", {
  enumerable: true,
  get: function () {
    return _handleInteractionCodeRedirect.handleInteractionCodeRedirect;
  }
});
Object.defineProperty(exports, "startTransaction", {
  enumerable: true,
  get: function () {
    return _startTransaction.startTransaction;
  }
});
Object.defineProperty(exports, "unlockAccount", {
  enumerable: true,
  get: function () {
    return _unlockAccount.unlockAccount;
  }
});

var _authenticate = require("./authenticate");

var _cancel = require("./cancel");

var _emailVerify = require("./emailVerify");

var _interact = require("./interact");

var _introspect = require("./introspect");

var _poll = require("./poll");

var _proceed = require("./proceed");

var _register = require("./register");

var _recoverPassword = require("./recoverPassword");

var _handleInteractionCodeRedirect = require("./handleInteractionCodeRedirect");

var _startTransaction = require("./startTransaction");

var _unlockAccount = require("./unlockAccount");

var _transactionMeta = require("./transactionMeta");

_Object$keys(_transactionMeta).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _transactionMeta[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _transactionMeta[key];
    }
  });
});
//# sourceMappingURL=index.js.map