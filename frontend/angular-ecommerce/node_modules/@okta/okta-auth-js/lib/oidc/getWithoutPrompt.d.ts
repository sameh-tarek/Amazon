import { OktaAuthInterface, TokenParams, TokenResponse } from '../types';
export declare function getWithoutPrompt(sdk: OktaAuthInterface, options: TokenParams): Promise<TokenResponse>;
