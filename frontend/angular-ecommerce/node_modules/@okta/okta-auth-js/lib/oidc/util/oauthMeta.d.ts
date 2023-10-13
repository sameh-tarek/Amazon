import { OAuthTransactionMeta, OktaAuthInterface, PKCETransactionMeta, TokenParams } from '../../types';
export declare function createOAuthMeta(sdk: OktaAuthInterface, tokenParams: TokenParams): OAuthTransactionMeta | PKCETransactionMeta;
