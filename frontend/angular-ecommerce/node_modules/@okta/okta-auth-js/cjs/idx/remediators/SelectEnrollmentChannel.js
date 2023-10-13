"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.SelectEnrollmentChannel = void 0;

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/values"));

var _find = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _reduce = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/reduce"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _Remediator = require("./Base/Remediator");

var _util = require("./util");

/*!
 * Copyright (c) 2021-present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * 
 * See the License for the specific language governing permissions and limitations under the License.
 */
class SelectEnrollmentChannel extends _Remediator.Remediator {
  canRemediate() {
    return Boolean((0, _values.default)(this).channel);
  }

  getNextStep(context) {
    const common = super.getNextStep();
    const options = this.getChannels();
    const authenticator = context.currentAuthenticator.value;
    return { ...common,
      ...(options && {
        options
      }),
      authenticator
    };
  }

  getChannels() {
    var _remediationValue$for, _context;

    const authenticator = (0, _util.getAuthenticatorFromRemediation)(this.remediation);
    const remediationValue = authenticator.value;
    return (_remediationValue$for = (0, _find.default)(_context = remediationValue.form.value).call(_context, ({
      name
    }) => name === 'channel')) === null || _remediationValue$for === void 0 ? void 0 : _remediationValue$for.options;
  }

  getData() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const remediationValue = this.remediation.value[0].value;
    return {
      authenticator: {
        id: remediationValue.form.value[0].value,
        channel: (0, _values.default)(this).channel
      },
      stateHandle: (0, _values.default)(this).stateHandle
    };
  }

  getValuesAfterProceed() {
    var _context2;

    let trimmedValues = (0, _filter.default)(_context2 = (0, _keys.default)((0, _values.default)(this))).call(_context2, valueKey => valueKey !== 'channel');
    return (0, _reduce.default)(trimmedValues).call(trimmedValues, (values, valueKey) => ({ ...values,
      [valueKey]: (0, _values.default)(this)[valueKey]
    }), {});
  }

}

exports.SelectEnrollmentChannel = SelectEnrollmentChannel;
(0, _defineProperty2.default)(SelectEnrollmentChannel, "remediationName", 'select-enrollment-channel');
//# sourceMappingURL=SelectEnrollmentChannel.js.map