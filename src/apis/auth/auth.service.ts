import { Injectable, Inject } from '@nestjs/common'
import {
  IAuthProvider,
  UserInfo,
  TokenVerificationResult,
} from 'src/common/interfaces/auth.interface'

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_PROVIDER') private readonly authProvider: IAuthProvider,
  ) {}

  async verifyToken(token: string): Promise<TokenVerificationResult> {
    return await this.authProvider.verifyToken(token)
  }

  async getUserInfo(token: string): Promise<UserInfo> {
    return await this.authProvider.getUserInfo(token)
  }

  async validateUser(token: string): Promise<UserInfo | null> {
    try {
      return await this.getUserInfo(token)
    } catch {
      return null
    }
  }
}
