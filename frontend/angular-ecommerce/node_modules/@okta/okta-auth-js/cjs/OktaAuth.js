"use strict";

var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");

var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.default = void 0;

var _assign = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/assign"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var constants = _interopRequireWildcard(require("./constants"));

var _tx = require("./tx");

var _pkce = _interopRequireDefault(require("./oidc/util/pkce"));

var _session = require("./session");

var _oidc = require("./oidc");

var features = _interopRequireWildcard(require("./features"));

var crypto = _interopRequireWildcard(require("./crypto"));

var webauthn = _interopRequireWildcard(require("./crypto/webauthn"));

var _browserStorage = _interopRequireDefault(require("./browser/browserStorage"));

var _util = require("./util");

var _TokenManager = require("./TokenManager");

var _ServiceManager = require("./ServiceManager");

var _http = require("./http");

var _PromiseQueue = _interopRequireDefault(require("./PromiseQueue"));

var _fingerprint = _interopRequireDefault(require("./browser/fingerprint"));

var _AuthStateManager = require("./AuthStateManager");

var _StorageManager = require("./StorageManager");

var _TransactionManager = _interopRequireDefault(require("./TransactionManager"));

var _options = require("./options");

var _idx = require("./idx");

var _OktaUserAgent = require("./OktaUserAgent");

var _parseFromUrl = require("./oidc/parseFromUrl");

var _transactionMeta = require("./idx/transactionMeta");

var _tinyEmitter = _interopRequireDefault(require("tiny-emitter"));

function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* eslint-disable max-statements */

/* eslint-disable complexity */

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

/* global window */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore 
// Do not use this type in code, so it won't be emitted in the declaration output
class OktaAuth {
  constructor(args) {
    (0, _defineProperty2.default)(this, "features", features);
    const options = this.options = (0, _options.buildOptions)(args); // eslint-disable-next-line @typescript-eslint/no-non-null-assertion

    this.storageManager = new _StorageManager.StorageManager(options.storageManager, options.cookies, options.storageUtil);
    this.transactionManager = new _TransactionManager.default((0, _assign.default)({
      storageManager: this.storageManager
    }, options.transactionManager));
    this._oktaUserAgent = new _OktaUserAgent.OktaUserAgent();
    this.tx = {
      status: _tx.transactionStatus.bind(null, this),
      resume: _tx.resumeTransaction.bind(null, this),
      exists: (0, _assign.default)(_tx.transactionExists.bind(null, this), {
        _get: name => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const storage = options.storageUtil.storage;
          return storage.get(name);
        }
      }),
      introspect: _tx.introspectAuthn.bind(null, this)
    };
    this.pkce = {
      DEFAULT_CODE_CHALLENGE_METHOD: _pkce.default.DEFAULT_CODE_CHALLENGE_METHOD,
      generateVerifier: _pkce.default.generateVerifier,
      computeChallenge: _pkce.default.computeChallenge
    }; // Add shims for compatibility, these will be removed in next major version. OKTA-362589

    (0, _assign.default)(this.options.storageUtil, {
      getPKCEStorage: this.storageManager.getLegacyPKCEStorage.bind(this.storageManager),
      getHttpCache: this.storageManager.getHttpCache.bind(this.storageManager)
    });
    this._pending = {
      handleLogin: false
    };

    if ((0, features.isBrowser)()) {
      this.options = (0, _assign.default)(this.options, {
        redirectUri: (0, _util.toAbsoluteUrl)(args.redirectUri, window.location.origin) // allow relative URIs

      });
    } // Digital clocks will drift over time, so the server
    // can misalign with the time reported by the browser.
    // The maxClockSkew allows relaxing the time-based
    // validation of tokens (in seconds, not milliseconds).
    // It currently defaults to 300, because 5 min is the
    // default maximum tolerance allowed by Kerberos.
    // (https://technet.microsoft.com/en-us/library/cc976357.aspx)


    if (!args.maxClockSkew && args.maxClockSkew !== 0) {
      this.options.maxClockSkew = constants.DEFAULT_MAX_CLOCK_SKEW;
    } else {
      this.options.maxClockSkew = args.maxClockSkew;
    } // As some end user's devices can have their date 
    // and time incorrectly set, allow for the disabling
    // of the jwt liftetime validation


    this.options.ignoreLifetime = !!args.ignoreLifetime;
    this.session = {
      close: _session.closeSession.bind(null, this),
      exists: _session.sessionExists.bind(null, this),
      get: _session.getSession.bind(null, this),
      refresh: _session.refreshSession.bind(null, this),
      setCookieAndRedirect: _session.setCookieAndRedirect.bind(null, this)
    };
    this._tokenQueue = new _PromiseQueue.default();

    const useQueue = method => {
      return _PromiseQueue.default.prototype.push.bind(this._tokenQueue, method, null);
    }; // eslint-disable-next-line max-len


    const getWithRedirectFn = useQueue(_oidc.getWithRedirect.bind(null, this));
    const getWithRedirectApi = (0, _assign.default)(getWithRedirectFn, {
      // This is exposed so we can set window.location in our tests
      _setLocation: function (url) {
        window.location = url;
      }
    }); // eslint-disable-next-line max-len

    const parseFromUrlFn = useQueue(_oidc.parseFromUrl.bind(null, this));
    const parseFromUrlApi = (0, _assign.default)(parseFromUrlFn, {
      // This is exposed so we can mock getting window.history in our tests
      _getHistory: function () {
        return window.history;
      },
      // This is exposed so we can mock getting window.location in our tests
      _getLocation: function () {
        return window.location;
      },
      // This is exposed so we can mock getting window.document in our tests
      _getDocument: function () {
        return window.document;
      }
    });
    this.token = {
      prepareTokenParams: _oidc.prepareTokenParams.bind(null, this),
      exchangeCodeForTokens: _oidc.exchangeCodeForTokens.bind(null, this),
      getWithoutPrompt: _oidc.getWithoutPrompt.bind(null, this),
      getWithPopup: _oidc.getWithPopup.bind(null, this),
      getWithRedirect: getWithRedirectApi,
      parseFromUrl: parseFromUrlApi,
      decode: _oidc.decodeToken,
      revoke: _oidc.revokeToken.bind(null, this),
      renew: _oidc.renewToken.bind(null, this),
      renewTokensWithRefresh: _oidc.renewTokensWithRefresh.bind(null, this),
      renewTokens: _oidc.renewTokens.bind(null, this),
      getUserInfo: _oidc.getUserInfo.bind(null, this),
      verify: _oidc.verifyToken.bind(null, this),
      isLoginRedirect: _oidc.isLoginRedirect.bind(null, this)
    }; // Wrap all async token API methods using MethodQueue to avoid issues with concurrency

    const syncMethods = [// sync methods
    'decode', 'isLoginRedirect', // already bound
    'getWithRedirect', 'parseFromUrl'];
    (0, _keys.default)(this.token).forEach(key => {
      if ((0, _indexOf.default)(syncMethods).call(syncMethods, key) >= 0) {
        // sync methods should not be wrapped
        return;
      }

      var method = this.token[key];
      this.token[key] = _PromiseQueue.default.prototype.push.bind(this._tokenQueue, method, null);
    }); // IDX

    const boundStartTransaction = _idx.startTransaction.bind(null, this);

    this.idx = {
      interact: _idx.interact.bind(null, this),
      introspect: _idx.introspect.bind(null, this),
      authenticate: _idx.authenticate.bind(null, this),
      register: _idx.register.bind(null, this),
      start: boundStartTransaction,
      startTransaction: boundStartTransaction,
      // Use `start` instead. `startTransaction` will be removed in 7.0
      poll: _idx.poll.bind(null, this),
      proceed: _idx.proceed.bind(null, this),
      cancel: _idx.cancel.bind(null, this),
      recoverPassword: _idx.recoverPassword.bind(null, this),
      // oauth redirect callback
      handleInteractionCodeRedirect: _idx.handleInteractionCodeRedirect.bind(null, this),
      // interaction required callback
      isInteractionRequired: _oidc.isInteractionRequired.bind(null, this),
      isInteractionRequiredError: _oidc.isInteractionRequiredError,
      // email verify callback
      handleEmailVerifyCallback: _idx.handleEmailVerifyCallback.bind(null, this),
      isEmailVerifyCallback: _idx.isEmailVerifyCallback,
      parseEmailVerifyCallback: _idx.parseEmailVerifyCallback,
      isEmailVerifyCallbackError: _idx.isEmailVerifyCallbackError,
      getSavedTransactionMeta: _transactionMeta.getSavedTransactionMeta.bind(null, this),
      createTransactionMeta: _transactionMeta.createTransactionMeta.bind(null, this),
      getTransactionMeta: _transactionMeta.getTransactionMeta.bind(null, this),
      saveTransactionMeta: _transactionMeta.saveTransactionMeta.bind(null, this),
      clearTransactionMeta: _transactionMeta.clearTransactionMeta.bind(null, this),
      isTransactionMetaValid: _transactionMeta.isTransactionMetaValid,
      setFlow: flow => {
        this.options.flow = flow;
      },
      getFlow: () => {
        return this.options.flow;
      },
      canProceed: _idx.canProceed.bind(null, this),
      unlockAccount: _idx.unlockAccount.bind(null, this)
    }; // HTTP

    this.http = {
      setRequestHeader: _http.setRequestHeader.bind(null, this)
    }; // Fingerprint API

    this.fingerprint = _fingerprint.default.bind(null, this);
    this.emitter = new _tinyEmitter.default(); // TokenManager

    this.tokenManager = new _TokenManager.TokenManager(this, args.tokenManager); // AuthStateManager

    this.authStateManager = new _AuthStateManager.AuthStateManager(this); // ServiceManager

    this.serviceManager = new _ServiceManager.ServiceManager(this, args.services);
  }

  start() {
    // TODO: review tokenManager.start
    this.tokenManager.start();

    if (!this.token.isLoginRedirect()) {
      this.authStateManager.updateAuthState();
    }

    this.serviceManager.start();
  }

  stop() {
    // TODO: review tokenManager.stop
    this.tokenManager.stop();
    this.serviceManager.stop();
  }

  setHeaders(headers) {
    this.options.headers = (0, _assign.default)({}, this.options.headers, headers);
  } // Authn  V1


  async signIn(opts) {
    return this.signInWithCredentials(opts);
  } // Authn  V1


  async signInWithCredentials(opts) {
    opts = (0, _util.clone)(opts || {});

    const _postToTransaction = options => {
      delete opts.sendFingerprint;
      return (0, _tx.postToTransaction)(this, '/api/v1/authn', opts, options);
    };

    if (!opts.sendFingerprint) {
      return _postToTransaction();
    }

    return this.fingerprint().then(function (fingerprint) {
      return _postToTransaction({
        headers: {
          'X-Device-Fingerprint': fingerprint
        }
      });
    });
  }

  async signInWithRedirect(opts = {}) {
    const {
      originalUri,
      ...additionalParams
    } = opts;

    if (this._pending.handleLogin) {
      // Don't trigger second round
      return;
    }

    this._pending.handleLogin = true;

    try {
      // Trigger default signIn redirect flow
      if (originalUri) {
        this.setOriginalUri(originalUri);
      }

      const params = (0, _assign.default)({
        // TODO: remove this line when default scopes are changed OKTA-343294
        scopes: this.options.scopes || ['openid', 'email', 'profile']
      }, additionalParams);
      await this.token.getWithRedirect(params);
    } finally {
      this._pending.handleLogin = false;
    }
  } // Ends the current Okta SSO session without redirecting to Okta.


  closeSession() {
    return this.session.close() // DELETE /api/v1/sessions/me
    .then(async () => {
      // Clear all local tokens
      this.tokenManager.clear();
    }).catch(function (e) {
      if (e.name === 'AuthApiError' && e.errorCode === 'E0000007') {
        // Session does not exist or has already been closed
        return null;
      }

      throw e;
    });
  } // Revokes the access token for the application session


  async revokeAccessToken(accessToken) {
    if (!accessToken) {
      accessToken = (await this.tokenManager.getTokens()).accessToken;
      const accessTokenKey = this.tokenManager.getStorageKeyByType('accessToken');
      this.tokenManager.remove(accessTokenKey);
    } // Access token may have been removed. In this case, we will silently succeed.


    if (!accessToken) {
      return _promise.default.resolve(null);
    }

    return this.token.revoke(accessToken);
  } // Revokes the refresh token for the application session


  async revokeRefreshToken(refreshToken) {
    if (!refreshToken) {
      refreshToken = (await this.tokenManager.getTokens()).refreshToken;
      const refreshTokenKey = this.tokenManager.getStorageKeyByType('refreshToken');
      this.tokenManager.remove(refreshTokenKey);
    } // Refresh token may have been removed. In this case, we will silently succeed.


    if (!refreshToken) {
      return _promise.default.resolve(null);
    }

    return this.token.revoke(refreshToken);
  }

  getSignOutRedirectUrl(options = {}) {
    let {
      idToken,
      postLogoutRedirectUri,
      state
    } = options;

    if (!idToken) {
      idToken = this.tokenManager.getTokensSync().idToken;
    }

    if (!idToken) {
      return '';
    }

    if (!postLogoutRedirectUri) {
      postLogoutRedirectUri = this.options.postLogoutRedirectUri;
    }

    const logoutUrl = (0, _oidc.getOAuthUrls)(this).logoutUrl;
    const idTokenHint = idToken.idToken; // a string

    let logoutUri = logoutUrl + '?id_token_hint=' + encodeURIComponent(idTokenHint);

    if (postLogoutRedirectUri) {
      logoutUri += '&post_logout_redirect_uri=' + encodeURIComponent(postLogoutRedirectUri);
    } // State allows option parameters to be passed to logout redirect uri


    if (state) {
      logoutUri += '&state=' + encodeURIComponent(state);
    }

    return logoutUri;
  } // Revokes refreshToken or accessToken, clears all local tokens, then redirects to Okta to end the SSO session.


  async signOut(options) {
    options = (0, _assign.default)({}, options); // postLogoutRedirectUri must be whitelisted in Okta Admin UI

    var defaultUri = window.location.origin;
    var currentUri = window.location.href;
    var postLogoutRedirectUri = options.postLogoutRedirectUri || this.options.postLogoutRedirectUri || defaultUri;
    var accessToken = options.accessToken;
    var refreshToken = options.refreshToken;
    var revokeAccessToken = options.revokeAccessToken !== false;
    var revokeRefreshToken = options.revokeRefreshToken !== false;

    if (revokeRefreshToken && typeof refreshToken === 'undefined') {
      refreshToken = this.tokenManager.getTokensSync().refreshToken;
    }

    if (revokeAccessToken && typeof accessToken === 'undefined') {
      accessToken = this.tokenManager.getTokensSync().accessToken;
    }

    if (!options.idToken) {
      options.idToken = this.tokenManager.getTokensSync().idToken;
    }

    if (revokeRefreshToken && refreshToken) {
      await this.revokeRefreshToken(refreshToken);
    }

    if (revokeAccessToken && accessToken) {
      await this.revokeAccessToken(accessToken);
    }

    const logoutUri = this.getSignOutRedirectUrl({ ...options,
      postLogoutRedirectUri
    }); // No logoutUri? This can happen if the storage was cleared.
    // Fallback to XHR signOut, then simulate a redirect to the post logout uri

    if (!logoutUri) {
      // local tokens are cleared once session is closed
      return this.closeSession() // can throw if the user cannot be signed out
      .then(function () {
        if (postLogoutRedirectUri === currentUri) {
          window.location.reload(); // force a hard reload if URI is not changing
        } else {
          window.location.assign(postLogoutRedirectUri);
        }
      });
    } else {
      if (options.clearTokensBeforeRedirect) {
        // Clear all local tokens
        this.tokenManager.clear();
      } else {
        this.tokenManager.addPendingRemoveFlags();
      } // Flow ends with logout redirect


      window.location.assign(logoutUri);
    }
  }

  webfinger(opts) {
    var url = '/.well-known/webfinger' + (0, _util.toQueryString)(opts);
    var options = {
      headers: {
        'Accept': 'application/jrd+json'
      }
    };
    return (0, _http.get)(this, url, options);
  } //
  // Common Methods from downstream SDKs
  //
  // Returns true if both accessToken and idToken are not expired
  // If `autoRenew` option is set, will attempt to renew expired tokens before returning.


  async isAuthenticated(options = {}) {
    // TODO: remove dependency on tokenManager options in next major version - OKTA-473815
    const {
      autoRenew,
      autoRemove
    } = this.tokenManager.getOptions();
    const shouldRenew = options.onExpiredToken ? options.onExpiredToken === 'renew' : autoRenew;
    const shouldRemove = options.onExpiredToken ? options.onExpiredToken === 'remove' : autoRemove;
    let {
      accessToken
    } = this.tokenManager.getTokensSync();

    if (accessToken && this.tokenManager.hasExpired(accessToken)) {
      accessToken = undefined;

      if (shouldRenew) {
        try {
          accessToken = await this.tokenManager.renew('accessToken');
        } catch {// Renew errors will emit an "error" event 
        }
      } else if (shouldRemove) {
        this.tokenManager.remove('accessToken');
      }
    }

    let {
      idToken
    } = this.tokenManager.getTokensSync();

    if (idToken && this.tokenManager.hasExpired(idToken)) {
      idToken = undefined;

      if (shouldRenew) {
        try {
          idToken = await this.tokenManager.renew('idToken');
        } catch {// Renew errors will emit an "error" event 
        }
      } else if (shouldRemove) {
        this.tokenManager.remove('idToken');
      }
    }

    return !!(accessToken && idToken);
  }

  async getUser() {
    const {
      idToken,
      accessToken
    } = this.tokenManager.getTokensSync();
    return this.token.getUserInfo(accessToken, idToken);
  }

  getIdToken() {
    const {
      idToken
    } = this.tokenManager.getTokensSync();
    return idToken ? idToken.idToken : undefined;
  }

  getAccessToken() {
    const {
      accessToken
    } = this.tokenManager.getTokensSync();
    return accessToken ? accessToken.accessToken : undefined;
  }

  getRefreshToken() {
    const {
      refreshToken
    } = this.tokenManager.getTokensSync();
    return refreshToken ? refreshToken.refreshToken : undefined;
  }
  /**
   * Store parsed tokens from redirect url
   */


  async storeTokensFromRedirect() {
    const {
      tokens
    } = await this.token.parseFromUrl();
    this.tokenManager.setTokens(tokens);
  }

  setOriginalUri(originalUri, state) {
    // always store in session storage
    const sessionStorage = _browserStorage.default.getSessionStorage();

    sessionStorage.setItem(constants.REFERRER_PATH_STORAGE_KEY, originalUri); // to support multi-tab flows, set a state in constructor or pass as param

    state = state || this.options.state;

    if (state) {
      const sharedStorage = this.storageManager.getOriginalUriStorage();
      sharedStorage.setItem(state, originalUri);
    }
  }

  getOriginalUri(state) {
    // Prefer shared storage (if state is available)
    state = state || this.options.state;

    if (state) {
      const sharedStorage = this.storageManager.getOriginalUriStorage();
      const originalUri = sharedStorage.getItem(state);

      if (originalUri) {
        return originalUri;
      }
    } // Try to load from session storage


    const storage = _browserStorage.default.getSessionStorage();

    return storage ? storage.getItem(constants.REFERRER_PATH_STORAGE_KEY) || undefined : undefined;
  }

  removeOriginalUri(state) {
    // Remove from sessionStorage
    const storage = _browserStorage.default.getSessionStorage();

    storage.removeItem(constants.REFERRER_PATH_STORAGE_KEY); // Also remove from shared storage

    state = state || this.options.state;

    if (state) {
      const sharedStorage = this.storageManager.getOriginalUriStorage();
      sharedStorage.removeItem && sharedStorage.removeItem(state);
    }
  }

  isLoginRedirect() {
    return (0, _oidc.isLoginRedirect)(this);
  }

  async handleLoginRedirect(tokens, originalUri) {
    let state = this.options.state; // Store tokens and update AuthState by the emitted events

    if (tokens) {
      this.tokenManager.setTokens(tokens);
      originalUri = originalUri || this.getOriginalUri(this.options.state);
    } else if (this.isLoginRedirect()) {
      try {
        // For redirect flow, get state from the URL and use it to retrieve the originalUri
        const oAuthResponse = await (0, _parseFromUrl.parseOAuthResponseFromUrl)(this, {});
        state = oAuthResponse.state;
        originalUri = originalUri || this.getOriginalUri(state);
        await this.storeTokensFromRedirect();
      } catch (e) {
        // auth state should be updated
        await this.authStateManager.updateAuthState();
        throw e;
      }
    } else {
      return; // nothing to do
    } // ensure auth state has been updated


    await this.authStateManager.updateAuthState(); // clear originalUri from storage

    this.removeOriginalUri(state); // Redirect to originalUri

    const {
      restoreOriginalUri
    } = this.options;

    if (restoreOriginalUri) {
      await restoreOriginalUri(this, originalUri);
    } else if (originalUri) {
      window.location.replace(originalUri);
    }
  }

  isPKCE() {
    return !!this.options.pkce;
  }

  hasResponseType(responseType) {
    let hasResponseType = false;

    if (Array.isArray(this.options.responseType) && this.options.responseType.length) {
      var _context;

      hasResponseType = (0, _indexOf.default)(_context = this.options.responseType).call(_context, responseType) >= 0;
    } else {
      hasResponseType = this.options.responseType === responseType;
    }

    return hasResponseType;
  }

  isAuthorizationCodeFlow() {
    return this.hasResponseType('code');
  } // { username, password, (relayState), (context) }
  // signIn(opts: SignInWithCredentialsOptions): Promise<AuthTransaction> {
  //   return postToTransaction(this, '/api/v1/authn', opts);
  // }


  getIssuerOrigin() {
    // Infer the URL from the issuer URL, omitting the /oauth2/{authServerId}
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.options.issuer.split('/oauth2/')[0];
  } // { username, (relayState) }


  forgotPassword(opts) {
    return (0, _tx.postToTransaction)(this, '/api/v1/authn/recovery/password', opts);
  } // { username, (relayState) }


  unlockAccount(opts) {
    return (0, _tx.postToTransaction)(this, '/api/v1/authn/recovery/unlock', opts);
  } // { recoveryToken }


  verifyRecoveryToken(opts) {
    return (0, _tx.postToTransaction)(this, '/api/v1/authn/recovery/token', opts);
  } // Escape hatch method to make arbitrary OKTA API call


  async invokeApiMethod(options) {
    if (!options.accessToken) {
      const accessToken = (await this.tokenManager.getTokens()).accessToken;
      options.accessToken = accessToken === null || accessToken === void 0 ? void 0 : accessToken.accessToken;
    }

    return (0, _http.httpRequest)(this, options);
  }

} // Hoist feature detection functions to prototype & static type


(0, _defineProperty2.default)(OktaAuth, "features", features);
(0, _defineProperty2.default)(OktaAuth, "crypto", crypto);
(0, _defineProperty2.default)(OktaAuth, "webauthn", webauthn);
OktaAuth.features = OktaAuth.prototype.features = features; // Also hoist constants for CommonJS users

(0, _assign.default)(OktaAuth, {
  constants
});
var _default = OktaAuth;
exports.default = _default;
module.exports = exports.default;
//# sourceMappingURL=OktaAuth.js.map