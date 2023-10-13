"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.Remediator = void 0;

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/values"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _reduce = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/reduce"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _find = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find"));

var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));

var _util = require("../util");

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

/* eslint-disable complexity */
// Base class - DO NOT expose static remediationName
class Remediator {
  constructor(remediation, values = {}, options = {}) {
    // assign fields to the instance
    this.values = { ...values
    };
    this.options = { ...options
    };
    this.formatAuthenticators();
    this.remediation = remediation;
  }

  formatAuthenticators() {
    var _context2, _context3;

    (0, _values.default)(this).authenticators = (0, _values.default)(this).authenticators || []; // ensure authenticators are in the correct format

    (0, _values.default)(this).authenticators = (0, _map.default)(_context2 = (0, _values.default)(this).authenticators).call(_context2, authenticator => {
      return (0, _util2.formatAuthenticator)(authenticator);
    }); // add authenticator (if any) to "authenticators"

    if ((0, _values.default)(this).authenticator) {
      const authenticator = (0, _util2.formatAuthenticator)((0, _values.default)(this).authenticator);
      const hasAuthenticatorInList = (0, _values.default)(this).authenticators.some(existing => {
        return (0, _util2.compareAuthenticators)(authenticator, existing);
      });

      if (!hasAuthenticatorInList) {
        (0, _values.default)(this).authenticators.push(authenticator);
      }
    } // save non-key meta to "authenticatorsData" field
    // authenticators will be removed after selection to avoid select-authenticator loop


    (0, _values.default)(this).authenticatorsData = (0, _reduce.default)(_context3 = (0, _values.default)(this).authenticators).call(_context3, (acc, authenticator) => {
      if (typeof authenticator === 'object' && (0, _keys.default)(authenticator).length > 1) {
        // save authenticator meta into authenticator data
        acc.push(authenticator);
      }

      return acc;
    }, (0, _values.default)(this).authenticatorsData || []);
  }

  getName() {
    return this.remediation.name;
  } // Override this method to provide custom check

  /* eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars */


  canRemediate() {
    var _context4;

    const required = (0, _util.getRequiredValues)(this.remediation);
    const needed = (0, _find.default)(_context4 = required).call(_context4, key => !this.hasData(key));

    if (needed) {
      return false; // missing data for a required field
    }

    return true; // all required fields have available data
  } // returns an object for the entire remediation form, or just a part


  getData(key) {
    if (!key) {
      var _context5;

      let allValues = (0, _util.getAllValues)(this.remediation);
      let res = (0, _reduce.default)(_context5 = allValues).call(_context5, (data, key) => {
        data[key] = this.getData(key); // recursive

        return data;
      }, {});
      return res;
    } // Map value by "map${Property}" function in each subClass


    if (typeof this[`map${(0, _util.titleCase)(key)}`] === 'function') {
      var _context6;

      const val = this[`map${(0, _util.titleCase)(key)}`]((0, _find.default)(_context6 = this.remediation.value).call(_context6, ({
        name
      }) => name === key));

      if (val) {
        return val;
      }
    } // If a map is defined for this key, return the first aliased property that returns a truthy value


    if ((0, _map.default)(this) && (0, _map.default)(this)[key]) {
      const entry = (0, _map.default)(this)[key];

      for (let i = 0; i < entry.length; i++) {
        let val = (0, _values.default)(this)[entry[i]];

        if (val) {
          return val;
        }
      }
    } // fallback: return the value by key


    return (0, _values.default)(this)[key];
  }

  hasData(key) {
    // no attempt to format, we want simple true/false
    return !!this.getData(key);
  }

  getNextStep(_context) {
    const name = this.getName();
    const inputs = this.getInputs();
    const authenticator = this.getAuthenticator(); // TODO: remove type field in the next major version change
    // https://oktainc.atlassian.net/browse/OKTA-431749

    const type = authenticator === null || authenticator === void 0 ? void 0 : authenticator.type;
    return {
      name,
      inputs,
      ...(type && {
        type
      }),
      ...(authenticator && {
        authenticator
      })
    };
  } // Get inputs for the next step


  getInputs() {
    const inputs = [];
    const inputsFromRemediation = this.remediation.value || [];
    inputsFromRemediation.forEach(inputFromRemediation => {
      let input;
      let {
        name,
        type,
        visible,
        messages
      } = inputFromRemediation;

      if (visible === false) {
        return; // Filter out invisible inputs, like stateHandle
      }

      if (typeof this[`getInput${(0, _util.titleCase)(name)}`] === 'function') {
        input = this[`getInput${(0, _util.titleCase)(name)}`](inputFromRemediation);
      } else if (type !== 'object') {
        // handle general primitive types
        let alias;
        const aliases = ((0, _map.default)(this) ? (0, _map.default)(this)[name] : null) || [];

        if (aliases.length === 1) {
          alias = aliases[0];
        } else {
          // try find key from values
          alias = (0, _find.default)(aliases).call(aliases, name => {
            var _context7;

            return (0, _includes.default)(_context7 = (0, _keys.default)((0, _values.default)(this))).call(_context7, name);
          });
        }

        if (alias) {
          input = { ...inputFromRemediation,
            name: alias
          };
        }
      }

      if (!input) {
        input = inputFromRemediation;
      }

      if (Array.isArray(input)) {
        input.forEach(i => inputs.push(i));
      } else {
        // guarantees field-level messages are passed back
        if (messages) {
          input.messages = messages;
        }

        inputs.push(input);
      }
    });
    return inputs;
  }

  static getMessages(remediation) {
    var _remediation$value$, _remediation$value$$f, _context8;

    if (!remediation.value) {
      return;
    }

    return (_remediation$value$ = remediation.value[0]) === null || _remediation$value$ === void 0 ? void 0 : (_remediation$value$$f = _remediation$value$.form) === null || _remediation$value$$f === void 0 ? void 0 : (0, _reduce.default)(_context8 = _remediation$value$$f.value).call(_context8, (messages, field) => {
      if (field.messages) {
        messages = [...messages, ...field.messages.value];
      }

      return messages;
    }, []);
  } // Prepare values for the next remediation
  // In general, remove used values from inputs for the current remediation
  // Override this method if special cases need be handled


  getValuesAfterProceed() {
    const inputsFromRemediation = this.remediation.value || []; // "raw" inputs from server response

    const inputsFromRemediator = this.getInputs(); // "aliased" inputs from SDK remediator

    const inputs = [...inputsFromRemediation, ...inputsFromRemediator]; // scrub all values related to this remediation

    for (const input of inputs) {
      delete (0, _values.default)(this)[input.name];
    }

    return (0, _values.default)(this);
  }

  getAuthenticator() {
    var _this$remediation$rel, _context9, _value$find, _context10;

    // relatesTo value may be an authenticator or an authenticatorEnrollment
    const relatesTo = (_this$remediation$rel = this.remediation.relatesTo) === null || _this$remediation$rel === void 0 ? void 0 : _this$remediation$rel.value;

    if (!relatesTo) {
      return;
    }

    const authenticatorFromRemediation = (0, _util.getAuthenticatorFromRemediation)(this.remediation);

    if (!authenticatorFromRemediation) {
      // Hopefully value is an authenticator
      return relatesTo;
    } // If relatesTo is an authenticatorEnrollment, the id is actually the enrollmentId
    // Let's get the correct authenticator id from the form value


    const id = (0, _find.default)(_context9 = authenticatorFromRemediation.form.value).call(_context9, ({
      name
    }) => name === 'id').value;
    const enrollmentId = (_value$find = (0, _find.default)(_context10 = authenticatorFromRemediation.form.value).call(_context10, ({
      name
    }) => name === 'enrollmentId')) === null || _value$find === void 0 ? void 0 : _value$find.value;
    return { ...relatesTo,
      id,
      enrollmentId
    };
  }

}

exports.Remediator = Remediator;
//# sourceMappingURL=Remediator.js.map