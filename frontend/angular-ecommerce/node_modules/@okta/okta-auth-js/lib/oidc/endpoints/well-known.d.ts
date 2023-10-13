import { OktaAuthInterface, WellKnownResponse } from '../../types';
export declare function getWellKnown(sdk: OktaAuthInterface, issuer?: string): Promise<WellKnownResponse>;
export declare function getKey(sdk: OktaAuthInterface, issuer: string, kid: string): Promise<string>;
