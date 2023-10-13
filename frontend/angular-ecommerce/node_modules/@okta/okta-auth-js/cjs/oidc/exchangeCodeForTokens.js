"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.exchangeCodeForTokens = exchangeCodeForTokens;

var _assign = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/assign"));

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _util = require("./util");

var _util2 = require("../util");

var _token = require("./endpoints/token");

var _handleOAuthResponse = require("./handleOAuthResponse");

/* eslint-disable @typescript-eslint/no-non-null-assertion */

/* eslint-disable max-len */

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
 *
 */
// codeVerifier is required. May pass either an authorizationCode or interactionCode
function exchangeCodeForTokens(sdk, tokenParams, urls) {
  urls = urls || (0, _util.getOAuthUrls)(sdk, tokenParams); // build params using defaults + options

  tokenParams = (0, _assign.default)({}, (0, _util.getDefaultTokenParams)(sdk), (0, _util2.clone)(tokenParams));
  const {
    authorizationCode,
    interactionCode,
    codeVerifier,
    clientId,
    redirectUri,
    scopes,
    ignoreSignature,
    state
  } = tokenParams;
  var getTokenOptions = {
    clientId,
    redirectUri,
    authorizationCode,
    interactionCode,
    codeVerifier
  };
  return (0, _token.postToTokenEndpoint)(sdk, getTokenOptions, urls).then(response => {
    var _context;

    // `handleOAuthResponse` hanadles responses from both `/authorize` and `/token` endpoints
    // Here we modify the response from `/token` so that it more closely matches a response from `/authorize`
    // `responseType` is used to validate that the expected tokens were returned
    const responseType = ['token']; // an accessToken will always be returned

    if ((0, _indexOf.default)(_context = scopes).call(_context, 'openid') !== -1) {
      responseType.push('id_token'); // an idToken will be returned if "openid" is in the scopes
    }

    const handleResponseOptions = {
      clientId,
      redirectUri,
      scopes,
      responseType,
      ignoreSignature
    };
    return (0, _handleOAuthResponse.handleOAuthResponse)(sdk, handleResponseOptions, response, urls).then(response => {
      // For compatibility, "code" is returned in the TokenResponse. OKTA-326091
      response.code = authorizationCode;
      response.state = state;
      return response;
    });
  }).finally(() => {
    sdk.transactionManager.clear();
  });
}
//# sourceMappingURL=exchangeCodeForTokens.js.map