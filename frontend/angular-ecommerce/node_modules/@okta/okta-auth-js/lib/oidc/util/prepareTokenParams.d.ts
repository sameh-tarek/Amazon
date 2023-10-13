import { OktaAuthInterface, TokenParams } from '../../types';
export declare function assertPKCESupport(sdk: OktaAuthInterface): void;
export declare function validateCodeChallengeMethod(sdk: OktaAuthInterface, codeChallengeMethod?: string): Promise<string>;
export declare function preparePKCE(sdk: OktaAuthInterface, tokenParams: TokenParams): Promise<TokenParams>;
export declare function prepareTokenParams(sdk: OktaAuthInterface, tokenParams?: TokenParams): Promise<TokenParams>;
