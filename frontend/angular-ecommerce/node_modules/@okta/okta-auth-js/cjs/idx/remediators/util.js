"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.getAllValues = getAllValues;
exports.getRequiredValues = getRequiredValues;
exports.titleCase = titleCase;
exports.getAuthenticatorFromRemediation = getAuthenticatorFromRemediation;

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _reduce = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/reduce"));

var _find = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find"));

/*!
 * Copyright (c) 2015-present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * 
 * See the License for the specific language governing permissions and limitations under the License.
 */
function getAllValues(idxRemediation) {
  var _idxRemediation$value;

  return (_idxRemediation$value = idxRemediation.value) === null || _idxRemediation$value === void 0 ? void 0 : (0, _map.default)(_idxRemediation$value).call(_idxRemediation$value, r => r.name);
}

function getRequiredValues(idxRemediation) {
  var _idxRemediation$value2;

  return (_idxRemediation$value2 = idxRemediation.value) === null || _idxRemediation$value2 === void 0 ? void 0 : (0, _reduce.default)(_idxRemediation$value2).call(_idxRemediation$value2, (required, cur) => {
    if (cur.required) {
      required.push(cur.name);
    }

    return required;
  }, []);
}

function titleCase(str) {
  return str.charAt(0).toUpperCase() + str.substring(1);
}

function getAuthenticatorFromRemediation(remediation) {
  var _context;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return (0, _find.default)(_context = remediation.value).call(_context, ({
    name
  }) => name === 'authenticator');
}
//# sourceMappingURL=util.js.map