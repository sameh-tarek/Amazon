"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.pruneSharedStorage = pruneSharedStorage;
exports.saveTransactionToSharedStorage = saveTransactionToSharedStorage;
exports.loadTransactionFromSharedStorage = loadTransactionFromSharedStorage;
exports.clearTransactionFromSharedStorage = clearTransactionFromSharedStorage;

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _types = require("../types");

const MAX_ENTRY_LIFETIME = 30 * 60 * 1000; // 30 minutes

function pruneSharedStorage(storageManager) {
  const sharedStorage = storageManager.getSharedTansactionStorage();
  const entries = sharedStorage.getStorage();
  (0, _keys.default)(entries).forEach(state => {
    const entry = entries[state];
    const age = Date.now() - entry.dateCreated;

    if (age > MAX_ENTRY_LIFETIME) {
      delete entries[state];
    }
  });
  sharedStorage.setStorage(entries);
}

function saveTransactionToSharedStorage(storageManager, state, meta) {
  const sharedStorage = storageManager.getSharedTansactionStorage();
  const entries = sharedStorage.getStorage();
  entries[state] = {
    dateCreated: Date.now(),
    transaction: meta
  };
  sharedStorage.setStorage(entries);
}

function loadTransactionFromSharedStorage(storageManager, state) {
  const sharedStorage = storageManager.getSharedTansactionStorage();
  const entries = sharedStorage.getStorage();
  const entry = entries[state];

  if (entry && entry.transaction && (0, _types.isTransactionMeta)(entry.transaction)) {
    return entry.transaction;
  }

  return null;
}

function clearTransactionFromSharedStorage(storageManager, state) {
  const sharedStorage = storageManager.getSharedTansactionStorage();
  const entries = sharedStorage.getStorage();
  delete entries[state];
  sharedStorage.setStorage(entries);
}
//# sourceMappingURL=sharedStorage.js.map