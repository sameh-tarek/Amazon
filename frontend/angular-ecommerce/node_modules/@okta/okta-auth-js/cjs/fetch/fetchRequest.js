"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.default = void 0;

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _entries = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/entries"));

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _entries2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/entries"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _crossFetch = _interopRequireDefault(require("cross-fetch"));

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
// content-type = application/json OR application/ion+json
const appJsonContentTypeRegex = /application\/\w*\+?json/;

function readData(response) {
  var _context;

  if (response.headers.get('Content-Type') && // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  (0, _indexOf.default)(_context = response.headers.get('Content-Type').toLowerCase()).call(_context, 'application/json') >= 0) {
    return response.json() // JSON parse can fail if response is not a valid object
    .catch(e => {
      return {
        error: e,
        errorSummary: 'Could not parse server response'
      };
    });
  } else {
    return response.text();
  }
}

function formatResult(status, data, response) {
  const isObject = typeof data === 'object';
  const headers = {};

  for (const pair of (0, _entries.default)(_context2 = response.headers).call(_context2)) {
    var _context2;

    headers[pair[0]] = pair[1];
  }

  const result = {
    responseText: isObject ? (0, _stringify.default)(data) : data,
    status: status,
    headers
  };

  if (isObject) {
    result.responseType = 'json';
    result.responseJSON = data;
  }

  return result;
}
/* eslint-disable complexity */


function fetchRequest(method, url, args) {
  var body = args.data;
  var headers = args.headers || {};
  var contentType = headers['Content-Type'] || headers['content-type'] || '';

  if (body && typeof body !== 'string') {
    // JSON encode body (if appropriate)
    if (appJsonContentTypeRegex.test(contentType)) {
      body = (0, _stringify.default)(body);
    } else if (contentType === 'application/x-www-form-urlencoded') {
      var _context3;

      body = (0, _map.default)(_context3 = (0, _entries2.default)(body)).call(_context3, ([param, value]) => `${param}=${encodeURIComponent(value)}`).join('&');
    }
  }

  var fetch = global.fetch || _crossFetch.default;
  var fetchPromise = fetch(url, {
    method: method,
    headers: args.headers,
    body: body,
    credentials: args.withCredentials ? 'include' : 'omit'
  });

  if (!fetchPromise.finally) {
    fetchPromise = _promise.default.resolve(fetchPromise);
  }

  return fetchPromise.then(function (response) {
    var error = !response.ok;
    var status = response.status;
    return readData(response).then(data => {
      return formatResult(status, data, response);
    }).then(result => {
      var _result$responseJSON;

      if (error || (_result$responseJSON = result.responseJSON) !== null && _result$responseJSON !== void 0 && _result$responseJSON.error) {
        // Throwing result object since error handling is done in http.js
        throw result;
      }

      return result;
    });
  });
}

var _default = fetchRequest;
exports.default = _default;
module.exports = exports.default;
//# sourceMappingURL=fetchRequest.js.map