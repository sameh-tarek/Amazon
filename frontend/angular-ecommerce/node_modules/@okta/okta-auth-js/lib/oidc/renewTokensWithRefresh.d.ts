import { OktaAuthInterface, TokenParams, RefreshToken, Tokens } from '../types';
export declare function renewTokensWithRefresh(sdk: OktaAuthInterface, tokenParams: TokenParams, refreshTokenObject: RefreshToken): Promise<Tokens>;
