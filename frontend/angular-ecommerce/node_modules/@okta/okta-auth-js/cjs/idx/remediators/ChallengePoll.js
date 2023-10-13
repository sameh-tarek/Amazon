"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.ChallengePoll = void 0;

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/values"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _EnrollPoll = require("./EnrollPoll");

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
class ChallengePoll extends _EnrollPoll.EnrollPoll {
  canRemediate() {
    return !!(0, _values.default)(this).startPolling || this.options.step === 'challenge-poll';
  }

}

exports.ChallengePoll = ChallengePoll;
(0, _defineProperty2.default)(ChallengePoll, "remediationName", 'challenge-poll');
//# sourceMappingURL=ChallengePoll.js.map