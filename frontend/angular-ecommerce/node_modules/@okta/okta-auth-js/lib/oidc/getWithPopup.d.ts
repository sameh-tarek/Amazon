import { OktaAuthInterface, TokenParams, TokenResponse } from '../types';
export declare function getWithPopup(sdk: OktaAuthInterface, options: TokenParams): Promise<TokenResponse>;
