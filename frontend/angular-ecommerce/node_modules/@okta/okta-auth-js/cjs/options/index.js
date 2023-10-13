"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.getDefaultOptions = getDefaultOptions;
exports.buildOptions = buildOptions;

var _assign = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/assign"));

var _util = require("../util");

var _builderUtil = require("../builderUtil");

var _fetchRequest = _interopRequireDefault(require("../fetch/fetchRequest"));

var _node = require("./node");

var _features = require("../features");

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
function getDefaultOptions() {
  const options = {
    devMode: false,
    httpRequestClient: _fetchRequest.default,
    storageUtil: (0, _node.getStorage)(),
    storageManager: _node.STORAGE_MANAGER_OPTIONS,
    transactionManager: {
      enableSharedStorage: _node.enableSharedStorage
    }
  };
  return options;
}

function mergeOptions(options, args) {
  return (0, _assign.default)({}, options, (0, _util.removeNils)(args), {
    storageManager: (0, _assign.default)({}, options.storageManager, args.storageManager),
    transactionManager: (0, _assign.default)({}, options.transactionManager, args.transactionManager)
  });
}

function buildOptions(args = {}) {
  (0, _builderUtil.assertValidConfig)(args);
  args = mergeOptions(getDefaultOptions(), args);
  return (0, _util.removeNils)({
    // OIDC configuration
    issuer: (0, _util.removeTrailingSlash)(args.issuer),
    tokenUrl: (0, _util.removeTrailingSlash)(args.tokenUrl),
    authorizeUrl: (0, _util.removeTrailingSlash)(args.authorizeUrl),
    userinfoUrl: (0, _util.removeTrailingSlash)(args.userinfoUrl),
    revokeUrl: (0, _util.removeTrailingSlash)(args.revokeUrl),
    logoutUrl: (0, _util.removeTrailingSlash)(args.logoutUrl),
    clientId: args.clientId,
    redirectUri: args.redirectUri,
    state: args.state,
    scopes: args.scopes,
    postLogoutRedirectUri: args.postLogoutRedirectUri,
    responseMode: args.responseMode,
    responseType: args.responseType,
    pkce: args.pkce === false ? false : true,
    // PKCE defaults to true
    useInteractionCodeFlow: args.useInteractionCodeFlow,
    // Internal options
    httpRequestClient: args.httpRequestClient,
    transformErrorXHR: args.transformErrorXHR,
    transformAuthState: args.transformAuthState,
    restoreOriginalUri: args.restoreOriginalUri,
    storageUtil: args.storageUtil,
    headers: args.headers,
    devMode: !!args.devMode,
    storageManager: args.storageManager,
    transactionManager: args.transactionManager,
    cookies: (0, _node.getCookieSettings)(args, (0, _features.isHTTPS)()),
    flow: args.flow,
    codeChallenge: args.codeChallenge,
    codeChallengeMethod: args.codeChallengeMethod,
    recoveryToken: args.recoveryToken,
    activationToken: args.activationToken,
    // Give the developer the ability to disable token signature validation.
    ignoreSignature: !!args.ignoreSignature,
    // Server-side web applications
    clientSecret: args.clientSecret
  });
}
//# sourceMappingURL=index.js.map