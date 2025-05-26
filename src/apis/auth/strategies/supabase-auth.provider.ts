import { Injectable } from '@nestjs/common'
import { UnauthorizedException } from '@nestjs/common'
import {
  IAuthProvider,
  TokenVerificationResult,
  UserInfo,
} from 'src/common/interfaces/auth.interface'

@Injectable()
export class SupabaseAuthProvider implements IAuthProvider {
  async verifyToken(token: string): Promise<TokenVerificationResult> {
    const res = await fetch('https://yourproject.supabase.co/auth/v1/user', {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new UnauthorizedException('Invalid token')

    const userData = await res.json()
    return {
      valid: true,
      payload: userData,
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.user_metadata?.name || userData.user_metadata?.full_name,
      },
    }
  }

  async getUserInfo(token: string): Promise<UserInfo> {
    const result = await this.verifyToken(token)
    if (!result.valid || !result.user) {
      throw new UnauthorizedException('Invalid token')
    }
    return result.user
  }
}
