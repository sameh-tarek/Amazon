import { OktaAuthInterface, CustomUrls } from '../../types';
export declare function generateState(): string;
export declare function generateNonce(): string;
export declare function getOAuthBaseUrl(sdk: OktaAuthInterface, options?: CustomUrls): any;
export declare function getOAuthDomain(sdk: OktaAuthInterface, options?: CustomUrls): any;
export declare function getOAuthUrls(sdk: OktaAuthInterface, options?: CustomUrls): CustomUrls;
