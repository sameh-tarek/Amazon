"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.AuthenticatorVerificationData = void 0;

var _reduce = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/reduce"));

var _find = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/values"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _errors = require("../../errors");

var _AuthenticatorData = require("./Base/AuthenticatorData");

/* eslint-disable @typescript-eslint/no-non-null-assertion */

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
class AuthenticatorVerificationData extends _AuthenticatorData.AuthenticatorData {
  // will be removed in next major version
  constructor(remediation, values = {}, options = {}) {
    super(remediation, values); // will be removed in next major version

    this.shouldProceedWithEmailAuthenticator = options.shouldProceedWithEmailAuthenticator !== false && this.authenticator.methods.length === 1 && this.authenticator.methods[0].type === 'email';
  }

  canRemediate() {
    // auto proceed if there is only one method (will be removed in next major version)
    if (this.shouldProceedWithEmailAuthenticator !== false) {
      return true;
    }

    return super.canRemediate();
  }

  mapAuthenticator() {
    // auto proceed with the only methodType option
    if (this.shouldProceedWithEmailAuthenticator !== false) {
      var _authenticatorFromRem, _context;

      const authenticatorFromRemediation = this.getAuthenticatorFromRemediation();
      return (_authenticatorFromRem = authenticatorFromRemediation.form) === null || _authenticatorFromRem === void 0 ? void 0 : (0, _reduce.default)(_context = _authenticatorFromRem.value).call(_context, (acc, curr) => {
        if (curr.value) {
          acc[curr.name] = curr.value;
        } else if (curr.options) {
          acc[curr.name] = curr.options[0].value;
        } else {
          throw new _errors.AuthSdkError(`Unsupported authenticator data type: ${curr}`);
        }

        return acc;
      }, {});
    }

    return this.getAuthenticatorData();
  }

  getInputAuthenticator() {
    var _context2;

    const authenticator = this.getAuthenticatorFromRemediation();
    const methodType = (0, _find.default)(_context2 = authenticator.form.value).call(_context2, ({
      name
    }) => name === 'methodType'); // if has methodType in form, let user select the methodType

    if (methodType && methodType.options) {
      return {
        name: 'methodType',
        type: 'string',
        required: true
      };
    } // no methodType, then return form values


    const inputs = [...authenticator.form.value];
    return inputs;
  }

  getValuesAfterProceed() {
    var _context3;

    this.values = super.getValuesAfterProceed();
    let trimmedValues = (0, _filter.default)(_context3 = (0, _keys.default)((0, _values.default)(this))).call(_context3, valueKey => valueKey !== 'authenticator');
    return (0, _reduce.default)(trimmedValues).call(trimmedValues, (values, valueKey) => ({ ...values,
      [valueKey]: (0, _values.default)(this)[valueKey]
    }), {});
  }

}

exports.AuthenticatorVerificationData = AuthenticatorVerificationData;
(0, _defineProperty2.default)(AuthenticatorVerificationData, "remediationName", 'authenticator-verification-data');
//# sourceMappingURL=AuthenticatorVerificationData.js.map