"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.SelectAuthenticatorUnlockAccount = void 0;

var _find = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find"));

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/values"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _SelectAuthenticator = require("./Base/SelectAuthenticator");

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
class SelectAuthenticatorUnlockAccount extends _SelectAuthenticator.SelectAuthenticator {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "map", {
      identifier: ['username']
    });
  }

  canRemediate() {
    const identifier = this.getData('identifier');
    return !!identifier && super.canRemediate();
  }

  mapAuthenticator(remediationValue) {
    var _this$selectedOption, _context, _methodTypeOption$opt, _methodTypeOption$opt2;

    const authenticatorMap = super.mapAuthenticator(remediationValue);
    const methodTypeOption = (_this$selectedOption = this.selectedOption) === null || _this$selectedOption === void 0 ? void 0 : (0, _find.default)(_context = _this$selectedOption.value.form.value).call(_context, ({
      name
    }) => name === 'methodType'); // defaults to 'manually defined' value
    // 2nd: option may have pre-defined value, like stateHandle
    // 3rd: if only a single OV option is available, default to that option

    const methodTypeValue = (0, _values.default)(this).methodType || (methodTypeOption === null || methodTypeOption === void 0 ? void 0 : methodTypeOption.value) || (methodTypeOption === null || methodTypeOption === void 0 ? void 0 : (_methodTypeOption$opt = methodTypeOption.options) === null || _methodTypeOption$opt === void 0 ? void 0 : (_methodTypeOption$opt2 = _methodTypeOption$opt[0]) === null || _methodTypeOption$opt2 === void 0 ? void 0 : _methodTypeOption$opt2.value);

    if (methodTypeValue) {
      return { ...authenticatorMap,
        methodType: methodTypeValue
      };
    }

    return authenticatorMap;
  }

  getInputUsername() {
    return {
      name: 'username',
      key: 'string'
    };
  }

}

exports.SelectAuthenticatorUnlockAccount = SelectAuthenticatorUnlockAccount;
(0, _defineProperty2.default)(SelectAuthenticatorUnlockAccount, "remediationName", 'select-authenticator-unlock-account');
//# sourceMappingURL=SelectAuthenticatorUnlockAccount.js.map