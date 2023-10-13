"use strict";

var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");

var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.isTerminalResponse = isTerminalResponse;
exports.canSkipFn = canSkipFn;
exports.canResendFn = canResendFn;
exports.getMessagesFromIdxRemediationValue = getMessagesFromIdxRemediationValue;
exports.getMessagesFromResponse = getMessagesFromResponse;
exports.getEnabledFeatures = getEnabledFeatures;
exports.getAvailableSteps = getAvailableSteps;
exports.filterValuesForRemediation = filterValuesForRemediation;
exports.getRemediator = getRemediator;
exports.getNextStep = getNextStep;
exports.handleIdxError = handleIdxError;

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));

var _reduce = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/reduce"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/values"));

var _find = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find"));

var _util = require("../util");

var remediators = _interopRequireWildcard(require("./remediators"));

var _types = require("./types");

var _idxJs = require("./types/idx-js");

function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function isTerminalResponse(idxResponse) {
  const {
    neededToProceed,
    interactionCode
  } = idxResponse;
  return !neededToProceed.length && !interactionCode;
}

function canSkipFn(idxResponse) {
  return idxResponse.neededToProceed.some(({
    name
  }) => name === 'skip');
}

function canResendFn(idxResponse) {
  return (0, _keys.default)(idxResponse.actions).some(actionName => (0, _includes.default)(actionName).call(actionName, 'resend'));
}

function getMessagesFromIdxRemediationValue(value) {
  if (!value || !Array.isArray(value)) {
    return;
  }

  return (0, _reduce.default)(value).call(value, (messages, value) => {
    if (value.messages) {
      messages = [...messages, ...value.messages.value];
    }

    if (value.form) {
      const messagesFromForm = getMessagesFromIdxRemediationValue(value.form.value) || [];
      messages = [...messages, ...messagesFromForm];
    }

    if (value.options) {
      let optionValues = [];
      value.options.forEach(option => {
        if (!option.value || typeof option.value === 'string') {
          return;
        }

        optionValues = [...optionValues, option.value];
      });
      const messagesFromOptions = getMessagesFromIdxRemediationValue(optionValues) || [];
      messages = [...messages, ...messagesFromOptions];
    }

    return messages;
  }, []);
}

function getMessagesFromResponse(idxResponse) {
  var _rawIdxState$messages, _context;

  let messages = [];
  const {
    rawIdxState,
    neededToProceed
  } = idxResponse; // Handle global messages

  const globalMessages = (_rawIdxState$messages = rawIdxState.messages) === null || _rawIdxState$messages === void 0 ? void 0 : (0, _map.default)(_context = _rawIdxState$messages.value).call(_context, message => message);

  if (globalMessages) {
    messages = [...messages, ...globalMessages];
  } // Handle field messages for current flow


  for (let remediation of neededToProceed) {
    const fieldMessages = getMessagesFromIdxRemediationValue(remediation.value);

    if (fieldMessages) {
      messages = [...messages, ...fieldMessages];
    }
  } // API may return identical error on same field, filter by i18n key


  const seen = {};
  messages = (0, _reduce.default)(messages).call(messages, (filtered, message) => {
    var _message$i18n;

    const key = (_message$i18n = message.i18n) === null || _message$i18n === void 0 ? void 0 : _message$i18n.key;

    if (key && seen[key]) {
      return filtered;
    }

    seen[key] = message;
    filtered = [...filtered, message];
    return filtered;
  }, []);
  return messages;
}

function getEnabledFeatures(idxResponse) {
  const res = [];
  const {
    actions,
    neededToProceed
  } = idxResponse;

  if (actions['currentAuthenticator-recover']) {
    res.push(_types.IdxFeature.PASSWORD_RECOVERY);
  }

  if (neededToProceed.some(({
    name
  }) => name === 'select-enroll-profile')) {
    res.push(_types.IdxFeature.REGISTRATION);
  }

  if (neededToProceed.some(({
    name
  }) => name === 'redirect-idp')) {
    res.push(_types.IdxFeature.SOCIAL_IDP);
  }

  if (neededToProceed.some(({
    name
  }) => name === 'unlock-account')) {
    res.push(_types.IdxFeature.ACCOUNT_UNLOCK);
  }

  return res;
}

function getAvailableSteps(idxResponse) {
  var _context2;

  const res = [];
  const remediatorMap = (0, _reduce.default)(_context2 = (0, _values.default)(remediators)).call(_context2, (map, remediatorClass) => {
    // Only add concrete subclasses to the map
    if (remediatorClass.remediationName) {
      map[remediatorClass.remediationName] = remediatorClass;
    }

    return map;
  }, {});

  for (let remediation of idxResponse.neededToProceed) {
    const T = remediatorMap[remediation.name];

    if (T) {
      const remediator = new T(remediation);
      res.push(remediator.getNextStep(idxResponse.context));
    }
  }

  return res;
}

function filterValuesForRemediation(idxResponse, remediationName, values) {
  var _context3;

  const remediations = idxResponse.neededToProceed || [];
  const remediation = (0, _find.default)(remediations).call(remediations, r => r.name === remediationName);

  if (!remediation) {
    // step was specified, but remediation was not found. This is unexpected!
    (0, _util.warn)(`filterValuesForRemediation: "${remediationName}" did not match any remediations`);
    return values;
  } // eslint-disable-next-line @typescript-eslint/no-non-null-assertion


  const valuesForRemediation = (0, _reduce.default)(_context3 = remediation.value).call(_context3, (res, entry) => {
    const {
      name,
      value
    } = entry;

    if (name === 'stateHandle') {
      res[name] = value; // use the stateHandle value in the remediation
    } else {
      res[name] = values[name]; // use the value provided by the caller
    }

    return res;
  }, {});
  return valuesForRemediation;
} // Return first match idxRemediation in allowed remediators
// eslint-disable-next-line complexity


function getRemediator(idxRemediations, values, options) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const remediators = options.remediators;
  let remediator; // remediation name specified by caller - fast-track remediator lookup 

  if (options.step) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const remediation = (0, _find.default)(idxRemediations).call(idxRemediations, ({
      name
    }) => name === options.step);

    if (remediation) {
      const T = remediation ? remediators[remediation.name] : undefined;
      return T ? new T(remediation, values, options) : undefined;
    } else {
      // step was specified, but remediation was not found. This is unexpected!
      (0, _util.warn)(`step "${options.step}" did not match any remediations`);
      return;
    }
  }

  const remediatorCandidates = [];

  for (let remediation of idxRemediations) {
    var _context4;

    const isRemeditionInFlow = (0, _includes.default)(_context4 = (0, _keys.default)(remediators)).call(_context4, remediation.name);

    if (!isRemeditionInFlow) {
      continue;
    }

    const T = remediators[remediation.name];
    remediator = new T(remediation, values, options);

    if (remediator.canRemediate()) {
      // found the remediator
      return remediator;
    } // remediator cannot handle the current values
    // maybe return for next step


    remediatorCandidates.push(remediator);
  }

  return remediatorCandidates[0];
}

function getNextStep(remediator, idxResponse) {
  const nextStep = remediator.getNextStep(idxResponse.context);
  const canSkip = canSkipFn(idxResponse);
  const canResend = canResendFn(idxResponse);
  return { ...nextStep,
    ...(canSkip && {
      canSkip
    }),
    ...(canResend && {
      canResend
    })
  };
}

function handleIdxError(e, remediator) {
  // Handle idx messages
  let idxResponse = (0, _idxJs.isIdxResponse)(e) ? e : null;

  if (!idxResponse) {
    // Thrown error terminates the interaction with idx
    throw e;
  }

  idxResponse = { ...idxResponse,
    requestDidSucceed: false
  };
  const terminal = isTerminalResponse(idxResponse);
  const messages = getMessagesFromResponse(idxResponse);

  if (terminal) {
    return {
      idxResponse,
      terminal,
      messages
    };
  } else {
    const nextStep = remediator && getNextStep(remediator, idxResponse);
    return {
      idxResponse,
      messages,
      ...(nextStep && {
        nextStep
      })
    };
  }
}
//# sourceMappingURL=util.js.map