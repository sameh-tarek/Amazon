"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.validateVersionConfig = validateVersionConfig;
exports.makeIdxState = makeIdxState;
exports.parsersForVersion = void 0;

var _constants = require("../../constants");

var _parsers = _interopRequireDefault(require("./v1/parsers"));

// auth-js/types
// idx/types
const parsersForVersion = function parsersForVersion(version) {
  switch (version) {
    case '1.0.0':
      return _parsers.default;

    case undefined:
    case null:
      throw new Error('Api version is required');

    default:
      throw new Error(`Unknown api version: ${version}.  Use an exact semver version.`);
  }
};

exports.parsersForVersion = parsersForVersion;

function validateVersionConfig(version) {
  if (!version) {
    throw new Error('version is required');
  }

  const cleanVersion = (version !== null && version !== void 0 ? version : '').replace(/[^0-9a-zA-Z._-]/, '');

  if (cleanVersion !== version || !version) {
    throw new Error('invalid version supplied - version is required and uses semver syntax');
  }

  parsersForVersion(version); // will throw for invalid version
}

function makeIdxState(authClient, rawIdxResponse, toPersist = {}, requestDidSucceed) {
  var _rawIdxResponse$versi;

  const version = (_rawIdxResponse$versi = rawIdxResponse === null || rawIdxResponse === void 0 ? void 0 : rawIdxResponse.version) !== null && _rawIdxResponse$versi !== void 0 ? _rawIdxResponse$versi : _constants.IDX_API_VERSION;
  validateVersionConfig(version);
  const {
    makeIdxState
  } = parsersForVersion(version);
  return makeIdxState(authClient, rawIdxResponse, toPersist, requestDidSucceed);
}
//# sourceMappingURL=index.js.map