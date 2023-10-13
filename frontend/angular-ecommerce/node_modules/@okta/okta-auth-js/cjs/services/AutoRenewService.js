"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.AutoRenewService = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _TokenManager = require("../TokenManager");

var _errors = require("../errors");

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
class AutoRenewService {
  constructor(tokenManager, options = {}) {
    (0, _defineProperty2.default)(this, "started", false);
    this.tokenManager = tokenManager;
    this.options = options;
    this.renewTimeQueue = [];
    this.onTokenExpiredHandler = this.onTokenExpiredHandler.bind(this);
  }

  shouldThrottleRenew() {
    let res = false;
    this.renewTimeQueue.push(Date.now());

    if (this.renewTimeQueue.length >= 10) {
      // get and remove first item from queue
      const firstTime = this.renewTimeQueue.shift();
      const lastTime = this.renewTimeQueue[this.renewTimeQueue.length - 1];
      res = lastTime - firstTime < 30 * 1000;
    }

    return res;
  }

  requiresLeadership() {
    // If tokens sync storage is enabled, handle tokens expiration only in 1 leader tab
    return !!this.options.syncStorage && (0, _features.isBrowser)();
  }

  onTokenExpiredHandler(key) {
    if (this.options.autoRenew) {
      if (this.shouldThrottleRenew()) {
        const error = new _errors.AuthSdkError('Too many token renew requests');
        this.tokenManager.emitError(error);
      } else {
        this.tokenManager.renew(key).catch(() => {}); // Renew errors will emit an "error" event 
      }
    } else if (this.options.autoRemove) {
      this.tokenManager.remove(key);
    }
  }

  canStart() {
    return !!this.options.autoRenew || !!this.options.autoRemove;
  }

  start() {
    if (this.canStart()) {
      this.stop();
      this.tokenManager.on(_TokenManager.EVENT_EXPIRED, this.onTokenExpiredHandler);
      this.started = true;
    }
  }

  stop() {
    if (this.started) {
      this.tokenManager.off(_TokenManager.EVENT_EXPIRED, this.onTokenExpiredHandler);
      this.renewTimeQueue = [];
      this.started = false;
    }
  }

  isStarted() {
    return this.started;
  }

}

exports.AutoRenewService = AutoRenewService;
//# sourceMappingURL=AutoRenewService.js.map