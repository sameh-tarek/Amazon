"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.SelectAuthenticator = void 0;

var _find = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find"));

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/values"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _Remediator = require("./Remediator");

var _util = require("../util");

var _types = require("../../types");

var _util2 = require("../../authenticator/util");

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
class SelectAuthenticator extends _Remediator.Remediator {
  // Find matched authenticator in provided order
  findMatchedOption(authenticators, options) {
    let option;

    for (let authenticator of authenticators) {
      option = (0, _find.default)(options).call(options, ({
        relatesTo
      }) => relatesTo.key === authenticator.key);

      if (option) {
        break;
      }
    }

    return option;
  }

  canRemediate() {
    const {
      authenticators,
      authenticator
    } = (0, _values.default)(this);
    const authenticatorFromRemediation = (0, _util.getAuthenticatorFromRemediation)(this.remediation);
    const {
      options
    } = authenticatorFromRemediation; // Let users select authenticator if no input is provided

    if (!authenticators || !authenticators.length) {
      return false;
    } // Authenticator is explicitly specified by id


    if ((0, _types.isAuthenticator)(authenticator) && authenticator.id) {
      return true;
    } // Proceed with provided authenticators


    const matchedOption = this.findMatchedOption(authenticators, options);

    if (matchedOption) {
      return true;
    }

    return false;
  }

  getNextStep() {
    var _context;

    const common = super.getNextStep();
    const authenticatorFromRemediation = (0, _util.getAuthenticatorFromRemediation)(this.remediation);
    const options = (0, _map.default)(_context = authenticatorFromRemediation.options).call(_context, option => {
      const {
        label,
        relatesTo
      } = option;
      const key = relatesTo.key;
      return {
        label,
        value: key
      };
    });
    return { ...common,
      options
    };
  }

  mapAuthenticator(remediationValue) {
    var _context2;

    const {
      authenticators,
      authenticator
    } = (0, _values.default)(this); // Authenticator is explicitly specified by id

    if ((0, _types.isAuthenticator)(authenticator) && authenticator.id) {
      this.selectedAuthenticator = authenticator; // track the selected authenticator

      return authenticator;
    }

    const {
      options
    } = remediationValue;
    const selectedOption = (0, _util2.findMatchedOption)(authenticators, options);
    this.selectedAuthenticator = selectedOption.relatesTo; // track the selected authenticator

    this.selectedOption = selectedOption;
    return {
      id: selectedOption === null || selectedOption === void 0 ? void 0 : (0, _find.default)(_context2 = selectedOption.value.form.value).call(_context2, ({
        name
      }) => name === 'id').value
    };
  }

  getInputAuthenticator() {
    return {
      name: 'authenticator',
      key: 'string'
    };
  }

  getValuesAfterProceed() {
    var _context3;

    this.values = super.getValuesAfterProceed(); // remove used authenticators

    const authenticators = (0, _filter.default)(_context3 = (0, _values.default)(this).authenticators).call(_context3, authenticator => {
      return (0, _util2.compareAuthenticators)(authenticator, this.selectedAuthenticator) !== true;
    });
    return { ...(0, _values.default)(this),
      authenticators
    };
  }

}

exports.SelectAuthenticator = SelectAuthenticator;
//# sourceMappingURL=SelectAuthenticator.js.map