"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.EnrollProfile = void 0;

var _find = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find"));

var _reduce = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/reduce"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/values"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _Remediator = require("./Base/Remediator");

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
class EnrollProfile extends _Remediator.Remediator {
  canRemediate() {
    var _context, _context2;

    const userProfileFromValues = this.getData().userProfile;

    if (!userProfileFromValues) {
      return false;
    } // eslint-disable-next-line max-len


    const userProfileFromRemediation = (0, _find.default)(_context = this.remediation.value).call(_context, ({
      name
    }) => name === 'userProfile');
    return (0, _reduce.default)(_context2 = userProfileFromRemediation.form.value).call(_context2, (canRemediate, curr) => {
      if (curr.required) {
        canRemediate = canRemediate && !!userProfileFromValues[curr.name];
      }

      return canRemediate;
    }, true);
  }

  mapUserProfile({
    form: {
      value: profileAttributes
    }
  }) {
    const attributeNames = (0, _map.default)(profileAttributes).call(profileAttributes, ({
      name
    }) => name);
    const data = (0, _reduce.default)(attributeNames).call(attributeNames, (attributeValues, attributeName) => (0, _values.default)(this)[attributeName] ? { ...attributeValues,
      [attributeName]: (0, _values.default)(this)[attributeName]
    } : attributeValues, {});

    if ((0, _keys.default)(data).length === 0) {
      return;
    }

    return data;
  }

  getInputUserProfile(input) {
    return [...input.form.value];
  }

  getErrorMessages(errorRemediation) {
    var _context3;

    return (0, _reduce.default)(_context3 = errorRemediation.value[0].form.value).call(_context3, (errors, field) => {
      if (field.messages) {
        errors.push(field.messages.value[0].message);
      }

      return errors;
    }, []);
  }

}

exports.EnrollProfile = EnrollProfile;
(0, _defineProperty2.default)(EnrollProfile, "remediationName", 'enroll-profile');
//# sourceMappingURL=EnrollProfile.js.map