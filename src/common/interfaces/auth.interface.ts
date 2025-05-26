// common/interfaces/auth.interface.ts

export interface UserInfo {
  id: string
  email?: string
  name?: string
  [key: string]: any // 추가 필드를 위한 인덱스 시그니처
}

export interface TokenVerificationResult {
  valid: boolean
  user?: UserInfo
  payload?: any
}

export interface IAuthProvider {
  verifyToken(token: string): Promise<TokenVerificationResult>
  getUserInfo(token: string): Promise<UserInfo>
}
