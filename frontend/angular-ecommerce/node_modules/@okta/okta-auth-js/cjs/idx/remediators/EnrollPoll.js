"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.EnrollPoll = void 0;

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/values"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _reduce = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/reduce"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _Remediator = require("./Base/Remediator");

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
class EnrollPoll extends _Remediator.Remediator {
  canRemediate() {
    return !!(0, _values.default)(this).startPolling || this.options.step === 'enroll-poll';
  }

  getNextStep(context) {
    const common = super.getNextStep(context);
    let authenticator = this.getAuthenticator();

    if (!authenticator && context !== null && context !== void 0 && context.currentAuthenticator) {
      authenticator = context.currentAuthenticator.value;
    }

    return { ...common,
      authenticator,
      poll: {
        required: true,
        refresh: this.remediation.refresh
      }
    };
  }

  getValuesAfterProceed() {
    var _context;

    let trimmedValues = (0, _filter.default)(_context = (0, _keys.default)((0, _values.default)(this))).call(_context, valueKey => valueKey !== 'startPolling');
    return (0, _reduce.default)(trimmedValues).call(trimmedValues, (values, valueKey) => ({ ...values,
      [valueKey]: (0, _values.default)(this)[valueKey]
    }), {});
  }

}

exports.EnrollPoll = EnrollPoll;
(0, _defineProperty2.default)(EnrollPoll, "remediationName", 'enroll-poll');
//# sourceMappingURL=EnrollPoll.js.map