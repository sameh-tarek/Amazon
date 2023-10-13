"use strict";

var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");

var _Remediator = require("./Base/Remediator");

_Object$keys(_Remediator).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _Remediator[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Remediator[key];
    }
  });
});

var _EnrollAuthenticator = require("./EnrollAuthenticator");

_Object$keys(_EnrollAuthenticator).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _EnrollAuthenticator[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _EnrollAuthenticator[key];
    }
  });
});

var _EnrollPoll = require("./EnrollPoll");

_Object$keys(_EnrollPoll).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _EnrollPoll[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _EnrollPoll[key];
    }
  });
});

var _SelectEnrollmentChannel = require("./SelectEnrollmentChannel");

_Object$keys(_SelectEnrollmentChannel).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _SelectEnrollmentChannel[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _SelectEnrollmentChannel[key];
    }
  });
});

var _EnrollmentChannelData = require("./EnrollmentChannelData");

_Object$keys(_EnrollmentChannelData).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _EnrollmentChannelData[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _EnrollmentChannelData[key];
    }
  });
});

var _ChallengeAuthenticator = require("./ChallengeAuthenticator");

_Object$keys(_ChallengeAuthenticator).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _ChallengeAuthenticator[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _ChallengeAuthenticator[key];
    }
  });
});

var _ChallengePoll = require("./ChallengePoll");

_Object$keys(_ChallengePoll).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _ChallengePoll[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _ChallengePoll[key];
    }
  });
});

var _ResetAuthenticator = require("./ResetAuthenticator");

_Object$keys(_ResetAuthenticator).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _ResetAuthenticator[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _ResetAuthenticator[key];
    }
  });
});

var _EnrollProfile = require("./EnrollProfile");

_Object$keys(_EnrollProfile).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _EnrollProfile[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _EnrollProfile[key];
    }
  });
});

var _Identify = require("./Identify");

_Object$keys(_Identify).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _Identify[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Identify[key];
    }
  });
});

var _ReEnrollAuthenticator = require("./ReEnrollAuthenticator");

_Object$keys(_ReEnrollAuthenticator).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _ReEnrollAuthenticator[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _ReEnrollAuthenticator[key];
    }
  });
});

var _RedirectIdp = require("./RedirectIdp");

_Object$keys(_RedirectIdp).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _RedirectIdp[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _RedirectIdp[key];
    }
  });
});

var _SelectAuthenticatorAuthenticate = require("./SelectAuthenticatorAuthenticate");

_Object$keys(_SelectAuthenticatorAuthenticate).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _SelectAuthenticatorAuthenticate[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _SelectAuthenticatorAuthenticate[key];
    }
  });
});

var _SelectAuthenticatorEnroll = require("./SelectAuthenticatorEnroll");

_Object$keys(_SelectAuthenticatorEnroll).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _SelectAuthenticatorEnroll[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _SelectAuthenticatorEnroll[key];
    }
  });
});

var _SelectAuthenticatorUnlockAccount = require("./SelectAuthenticatorUnlockAccount");

_Object$keys(_SelectAuthenticatorUnlockAccount).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _SelectAuthenticatorUnlockAccount[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _SelectAuthenticatorUnlockAccount[key];
    }
  });
});

var _SelectEnrollProfile = require("./SelectEnrollProfile");

_Object$keys(_SelectEnrollProfile).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _SelectEnrollProfile[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _SelectEnrollProfile[key];
    }
  });
});

var _AuthenticatorVerificationData = require("./AuthenticatorVerificationData");

_Object$keys(_AuthenticatorVerificationData).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _AuthenticatorVerificationData[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _AuthenticatorVerificationData[key];
    }
  });
});

var _AuthenticatorEnrollmentData = require("./AuthenticatorEnrollmentData");

_Object$keys(_AuthenticatorEnrollmentData).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _AuthenticatorEnrollmentData[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _AuthenticatorEnrollmentData[key];
    }
  });
});

var _Skip = require("./Skip");

_Object$keys(_Skip).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _Skip[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Skip[key];
    }
  });
});
//# sourceMappingURL=index.js.map