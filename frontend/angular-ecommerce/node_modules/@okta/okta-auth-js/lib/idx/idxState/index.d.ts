import { OktaAuthInterface } from '../../types';
import { IdxResponse, RawIdxResponse } from '../types/idx-js';
export declare const parsersForVersion: (version: any) => {
    makeIdxState: typeof import("./v1/makeIdxState").makeIdxState;
};
export declare function validateVersionConfig(version: any): void;
export declare function makeIdxState(authClient: OktaAuthInterface, rawIdxResponse: RawIdxResponse, toPersist: Record<string, unknown> | undefined, requestDidSucceed: boolean): IdxResponse;
