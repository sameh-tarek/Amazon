import { OktaAuthInterface, OAuthResponse, TokenParams, TokenResponse, CustomUrls } from '../types';
export declare function handleOAuthResponse(sdk: OktaAuthInterface, tokenParams: TokenParams, res: OAuthResponse, urls?: CustomUrls): Promise<TokenResponse>;
