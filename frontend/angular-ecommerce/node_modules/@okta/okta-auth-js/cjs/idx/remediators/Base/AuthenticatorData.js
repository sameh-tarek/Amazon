"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.AuthenticatorData = void 0;

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/values"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _find = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _Remediator = require("./Remediator");

var _types = require("../../types");

var _util = require("../../authenticator/util");

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
// Base class - DO NOT expose static remediationName
class AuthenticatorData extends _Remediator.Remediator {
  constructor(remediation, values = {}) {
    super(remediation, values); // set before other data calculation

    this.authenticator = this.getAuthenticator();
    this.formatAuthenticatorData();
  }

  formatAuthenticatorData() {
    const authenticatorData = this.getAuthenticatorData();

    if (authenticatorData) {
      var _context;

      (0, _values.default)(this).authenticatorsData = (0, _map.default)(_context = (0, _values.default)(this).authenticatorsData).call(_context, data => {
        if ((0, _util.compareAuthenticators)(this.authenticator, data)) {
          return this.mapAuthenticatorDataFromValues(data);
        }

        return data;
      });
    } else {
      const data = this.mapAuthenticatorDataFromValues();

      if (data) {
        (0, _values.default)(this).authenticatorsData.push(data);
      }
    }
  }

  getAuthenticatorData() {
    var _context2;

    return (0, _find.default)(_context2 = (0, _values.default)(this).authenticatorsData).call(_context2, data => (0, _util.compareAuthenticators)(this.authenticator, data));
  }

  canRemediate() {
    return (0, _values.default)(this).authenticatorsData.some(data => (0, _util.compareAuthenticators)(this.authenticator, data));
  }

  getNextStep() {
    const common = super.getNextStep();
    const options = this.getMethodTypes();
    return { ...common,
      ...(options && {
        options
      })
    };
  }

  mapAuthenticatorDataFromValues(authenticatorData) {
    // add methodType to authenticatorData if it exists in values
    let {
      methodType,
      authenticator
    } = (0, _values.default)(this);

    if (!methodType && (0, _types.isAuthenticator)(authenticator)) {
      methodType = authenticator === null || authenticator === void 0 ? void 0 : authenticator.methodType;
    }

    const {
      id,
      enrollmentId
    } = this.authenticator;
    const data = {
      id,
      enrollmentId,
      ...(authenticatorData && authenticatorData),
      ...(methodType && {
        methodType
      })
    };
    return data.methodType ? data : null;
  }

  getAuthenticatorFromRemediation() {
    var _context3;

    const authenticator = (0, _find.default)(_context3 = this.remediation.value).call(_context3, ({
      name
    }) => name === 'authenticator');
    return authenticator;
  }

  getMethodTypes() {
    var _value$find, _context4;

    const authenticator = this.getAuthenticatorFromRemediation();
    return (_value$find = (0, _find.default)(_context4 = authenticator.form.value).call(_context4, ({
      name
    }) => name === 'methodType')) === null || _value$find === void 0 ? void 0 : _value$find.options;
  }

  getValuesAfterProceed() {
    var _context5;

    this.values = super.getValuesAfterProceed(); // remove used authenticatorData

    const authenticatorsData = (0, _filter.default)(_context5 = (0, _values.default)(this).authenticatorsData).call(_context5, data => (0, _util.compareAuthenticators)(this.authenticator, data) !== true);
    return { ...(0, _values.default)(this),
      authenticatorsData
    };
  }

}

exports.AuthenticatorData = AuthenticatorData;
//# sourceMappingURL=AuthenticatorData.js.map