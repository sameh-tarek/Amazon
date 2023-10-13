"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.EnrollmentChannelData = void 0;

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/values"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));

var _reduce = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/reduce"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _Remediator = require("./Base/Remediator");

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
class EnrollmentChannelData extends _Remediator.Remediator {
  getInputEmail() {
    return [{
      name: 'email',
      type: 'string',
      required: true,
      label: 'Email'
    }];
  }

  getInputPhoneNumber() {
    return [{
      name: 'phoneNumber',
      type: 'string',
      required: true,
      label: 'Phone Number'
    }];
  }

  canRemediate() {
    return Boolean((0, _values.default)(this).email || (0, _values.default)(this).phoneNumber);
  }

  getNextStep(context) {
    const common = super.getNextStep();
    const authenticator = context.currentAuthenticator.value;
    return { ...common,
      authenticator
    };
  }

  getData() {
    return {
      stateHandle: (0, _values.default)(this).stateHandle,
      email: (0, _values.default)(this).email,
      phoneNumber: (0, _values.default)(this).phoneNumber
    };
  }

  getValuesAfterProceed() {
    var _context;

    let trimmedValues = (0, _filter.default)(_context = (0, _keys.default)((0, _values.default)(this))).call(_context, valueKey => {
      var _context2;

      return !(0, _includes.default)(_context2 = ['email', 'phoneNumber']).call(_context2, valueKey);
    });
    return (0, _reduce.default)(trimmedValues).call(trimmedValues, (values, valueKey) => ({ ...values,
      [valueKey]: (0, _values.default)(this)[valueKey]
    }), {});
  }

}

exports.EnrollmentChannelData = EnrollmentChannelData;
(0, _defineProperty2.default)(EnrollmentChannelData, "remediationName", 'enrollment-channel-data');
//# sourceMappingURL=EnrollmentChannelData.js.map