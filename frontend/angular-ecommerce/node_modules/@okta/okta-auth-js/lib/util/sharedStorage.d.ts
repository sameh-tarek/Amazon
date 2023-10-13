import { TransactionMeta } from '../types';
import { StorageManager } from '../StorageManager';
export declare function pruneSharedStorage(storageManager: StorageManager): void;
export declare function saveTransactionToSharedStorage(storageManager: StorageManager, state: string, meta: TransactionMeta): void;
export declare function loadTransactionFromSharedStorage(storageManager: StorageManager, state: string): any;
export declare function clearTransactionFromSharedStorage(storageManager: StorageManager, state: string): void;
