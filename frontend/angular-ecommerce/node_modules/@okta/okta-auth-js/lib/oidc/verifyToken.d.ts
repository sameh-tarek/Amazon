import { IDToken, OktaAuthInterface, TokenVerifyParams } from '../types';
export declare function verifyToken(sdk: OktaAuthInterface, token: IDToken, validationParams: TokenVerifyParams): Promise<IDToken>;
