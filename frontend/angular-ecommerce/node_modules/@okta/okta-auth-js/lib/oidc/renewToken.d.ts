import { OktaAuthInterface, Token } from '../types';
export declare function renewToken(sdk: OktaAuthInterface, token: Token): Promise<Token | undefined>;
