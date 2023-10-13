import { OktaAuthInterface, TokenParams, PopupParams } from '../types';
export declare function getToken(sdk: OktaAuthInterface, options: TokenParams & PopupParams): Promise<import("../types").TokenResponse>;
