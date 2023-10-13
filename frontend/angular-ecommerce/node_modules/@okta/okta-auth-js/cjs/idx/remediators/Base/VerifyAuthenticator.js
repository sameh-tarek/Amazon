"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.VerifyAuthenticator = void 0;

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/values"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _reduce = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/reduce"));

var _Remediator = require("./Remediator");

var _authenticator = require("../../authenticator");

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
// Base class - DO NOT expose static remediationName
class VerifyAuthenticator extends _Remediator.Remediator {
  constructor(remediation, values = {}) {
    super(remediation, values);
    this.authenticator = (0, _authenticator.getAuthenticator)(remediation);
  }

  getNextStep(context) {
    var _context$authenticato;

    const nextStep = super.getNextStep(context);
    const authenticatorEnrollments = context === null || context === void 0 ? void 0 : (_context$authenticato = context.authenticatorEnrollments) === null || _context$authenticato === void 0 ? void 0 : _context$authenticato.value;
    return { ...nextStep,
      authenticatorEnrollments
    };
  }

  canRemediate() {
    return this.authenticator.canVerify((0, _values.default)(this));
  }

  mapCredentials() {
    return this.authenticator.mapCredentials((0, _values.default)(this));
  }

  getInputCredentials(input) {
    return this.authenticator.getInputs(input);
  }

  getValuesAfterProceed() {
    var _context;

    this.values = super.getValuesAfterProceed();
    let trimmedValues = (0, _filter.default)(_context = (0, _keys.default)((0, _values.default)(this))).call(_context, valueKey => valueKey !== 'credentials');
    return (0, _reduce.default)(trimmedValues).call(trimmedValues, (values, valueKey) => ({ ...values,
      [valueKey]: (0, _values.default)(this)[valueKey]
    }), {});
  }

}

exports.VerifyAuthenticator = VerifyAuthenticator;
//# sourceMappingURL=VerifyAuthenticator.js.map