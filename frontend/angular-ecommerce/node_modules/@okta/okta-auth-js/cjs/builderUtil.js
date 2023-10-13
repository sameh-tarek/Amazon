"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.assertValidConfig = assertValidConfig;

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _AuthSdkError = _interopRequireDefault(require("./errors/AuthSdkError"));

/*!
 * Copyright (c) 2018-present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */
// TODO: use @okta/configuration-validation (move module to this monorepo?)
// eslint-disable-next-line complexity
function assertValidConfig(args) {
  args = args || {};
  var scopes = args.scopes;

  if (scopes && !Array.isArray(scopes)) {
    throw new _AuthSdkError.default('scopes must be a array of strings. ' + 'Required usage: new OktaAuth({scopes: ["openid", "email"]})');
  } // eslint-disable-next-line @typescript-eslint/no-non-null-assertion


  var issuer = args.issuer;

  if (!issuer) {
    throw new _AuthSdkError.default('No issuer passed to constructor. ' + 'Required usage: new OktaAuth({issuer: "https://{yourOktaDomain}.com/oauth2/{authServerId}"})');
  }

  var isUrlRegex = new RegExp('^http?s?://.+');

  if (!isUrlRegex.test(issuer)) {
    throw new _AuthSdkError.default('Issuer must be a valid URL. ' + 'Required usage: new OktaAuth({issuer: "https://{yourOktaDomain}.com/oauth2/{authServerId}"})');
  }

  if ((0, _indexOf.default)(issuer).call(issuer, '-admin.') !== -1) {
    throw new _AuthSdkError.default('Issuer URL passed to constructor contains "-admin" in subdomain. ' + 'Required usage: new OktaAuth({issuer: "https://{yourOktaDomain}.com})');
  }
}
//# sourceMappingURL=builderUtil.js.map