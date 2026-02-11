export interface ITokenProvider {
  createAccessToken(payload: Record<string, any>): Promise<string>;
  createRefreshToken(payload: Record<string, any>): Promise<string>;
  verifyAccessToken(token: string): Promise<Record<string, any>>;
  verifyRefreshToken(token: string): Promise<Record<string, any>>;
}
