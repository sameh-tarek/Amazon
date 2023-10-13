"use strict";

exports.OktaPassword = void 0;

var _Authenticator = require("./Authenticator");

class OktaPassword extends _Authenticator.Authenticator {
  canVerify(values) {
    return !!(values.credentials || values.password);
  }

  mapCredentials(values) {
    const {
      credentials,
      password
    } = values;

    if (!credentials && !password) {
      return;
    }

    return credentials || {
      passcode: password
    };
  }

  getInputs(idxRemediationValue) {
    var _idxRemediationValue$;

    return { ...((_idxRemediationValue$ = idxRemediationValue.form) === null || _idxRemediationValue$ === void 0 ? void 0 : _idxRemediationValue$.value[0]),
      name: 'password',
      type: 'string',
      required: idxRemediationValue.required
    };
  }

}

exports.OktaPassword = OktaPassword;
//# sourceMappingURL=OktaPassword.js.map