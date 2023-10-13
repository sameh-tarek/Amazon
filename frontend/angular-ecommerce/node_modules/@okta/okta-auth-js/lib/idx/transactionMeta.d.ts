/*!
 * Copyright (c) 2021, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */
import { OktaAuthInterface, IdxTransactionMeta, TransactionMetaOptions } from '../types';
export declare function createTransactionMeta(authClient: OktaAuthInterface, options?: TransactionMetaOptions): Promise<IdxTransactionMeta>;
export declare function hasSavedInteractionHandle(authClient: OktaAuthInterface, options?: TransactionMetaOptions): boolean;
export declare function getSavedTransactionMeta(authClient: OktaAuthInterface, options?: TransactionMetaOptions): IdxTransactionMeta | undefined;
export declare function getTransactionMeta(authClient: OktaAuthInterface, options?: TransactionMetaOptions): Promise<IdxTransactionMeta>;
export declare function saveTransactionMeta(authClient: OktaAuthInterface, meta: any): void;
export declare function clearTransactionMeta(authClient: OktaAuthInterface): void;
export declare function isTransactionMetaValid(meta: any, options?: TransactionMetaOptions): boolean;
export declare function isTransactionMetaValidForFlow(meta: any, flow: any): boolean;
export declare function isTransactionMetaValidForOptions(meta: any, options: any, keys: any): boolean;
