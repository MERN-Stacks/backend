import { Injectable } from '@nestjs/common'
import {
  IAuthProvider,
  TokenVerificationResult,
  UserInfo,
} from 'src/common/interfaces/auth.interface'

@Injectable()
export class MockAuthProvider implements IAuthProvider {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async verifyToken(_token: string): Promise<TokenVerificationResult> {
    return Promise.resolve({
      valid: true,
      payload: { user_id: 'test-user', role: 'tester' },
      user: {
        id: 'test-user',
        email: 'test@example.com',
        name: 'Test User',
        role: 'tester',
      },
    })
  }

  async getUserInfo(token: string): Promise<UserInfo> {
    const result = await this.verifyToken(token)
    if (!result.valid || !result.user) {
      throw new Error('Invalid token')
    }
    return result.user
  }
}
