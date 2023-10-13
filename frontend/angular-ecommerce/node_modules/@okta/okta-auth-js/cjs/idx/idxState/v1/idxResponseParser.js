"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.parseIdxResponse = exports.parseNonRemediations = void 0;

var _fromEntries = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/from-entries"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _entries = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/entries"));

var _remediationParser = require("./remediationParser");

var _generateIdxAction = _interopRequireDefault(require("./generateIdxAction"));

var _jsonpathPlus = require("jsonpath-plus");

var _context;

const SKIP_FIELDS = (0, _fromEntries.default)((0, _map.default)(_context = ['remediation', // remediations are put into proceed/neededToProceed
'context' // the API response of 'context' isn't externally useful.  We ignore it and put all non-action (contextual) info into idxState.context
]).call(_context, field => [field, !!'skip this field']));

const parseNonRemediations = function parseNonRemediations(authClient, idxResponse, toPersist = {}) {
  var _context2;

  const actions = {};
  const context = {};
  (0, _filter.default)(_context2 = (0, _keys.default)(idxResponse)).call(_context2, field => !SKIP_FIELDS[field]).forEach(field => {
    const fieldIsObject = typeof idxResponse[field] === 'object' && !!idxResponse[field];

    if (!fieldIsObject) {
      // simple fields are contextual info
      context[field] = idxResponse[field];
      return;
    }

    if (idxResponse[field].rel) {
      // top level actions
      actions[idxResponse[field].name] = (0, _generateIdxAction.default)(authClient, idxResponse[field], toPersist);
      return;
    }

    const {
      value: fieldValue,
      type,
      ...info
    } = idxResponse[field];
    context[field] = {
      type,
      ...info
    }; // add the non-action parts as context

    if (type !== 'object') {
      // only object values hold actions
      context[field].value = fieldValue;
      return;
    } // We are an object field containing an object value


    context[field].value = {};
    (0, _entries.default)(fieldValue).forEach(([subField, value]) => {
      if (value.rel) {
        // is [field].value[subField] an action?
        // add any "action" value subfields to actions
        actions[`${field}-${subField.name || subField}`] = (0, _generateIdxAction.default)(authClient, value, toPersist);
      } else {
        // add non-action value subfields to context
        context[field].value[subField] = value;
      }
    });
  });
  return {
    context,
    actions
  };
};

exports.parseNonRemediations = parseNonRemediations;

const expandRelatesTo = (idxResponse, value) => {
  (0, _keys.default)(value).forEach(k => {
    if (k === 'relatesTo') {
      const query = Array.isArray(value[k]) ? value[k][0] : value[k];

      if (typeof query === 'string') {
        // eslint-disable-next-line new-cap
        const result = (0, _jsonpathPlus.JSONPath)({
          path: query,
          json: idxResponse
        })[0];

        if (result) {
          value[k] = result;
          return;
        }
      }
    }

    if (Array.isArray(value[k])) {
      value[k].forEach(innerValue => expandRelatesTo(idxResponse, innerValue));
    }
  });
};

const convertRemediationAction = (authClient, remediation, toPersist) => {
  const remediationActions = (0, _remediationParser.generateRemediationFunctions)(authClient, [remediation], toPersist);
  const actionFn = remediationActions[remediation.name];
  return { ...remediation,
    action: actionFn
  };
};

const parseIdxResponse = function parseIdxResponse(authClient, idxResponse, toPersist = {}) {
  var _idxResponse$remediat;

  const remediationData = ((_idxResponse$remediat = idxResponse.remediation) === null || _idxResponse$remediat === void 0 ? void 0 : _idxResponse$remediat.value) || [];
  remediationData.forEach(remediation => expandRelatesTo(idxResponse, remediation));
  const remediations = (0, _map.default)(remediationData).call(remediationData, remediation => convertRemediationAction(authClient, remediation, toPersist));
  const {
    context,
    actions
  } = parseNonRemediations(authClient, idxResponse, toPersist);
  return {
    remediations,
    context,
    actions
  };
};

exports.parseIdxResponse = parseIdxResponse;
//# sourceMappingURL=idxResponseParser.js.map