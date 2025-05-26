import { UnauthorizedException } from '@nestjs/common'
import { Inject } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'
import {
  IAuthProvider,
  TokenVerificationResult,
  UserInfo,
} from 'src/common/interfaces/auth.interface'

export const JWT_SECRET = 'JWT_SECRET'

@Injectable()
export class JwtAuthProvider implements IAuthProvider {
  constructor(@Inject(JWT_SECRET) private readonly secret: string) {}

  async verifyToken(token: string): Promise<TokenVerificationResult> {
    try {
      const payload = jwt.verify(token, this.secret) as any
      return Promise.resolve({
        valid: true,
        payload,
        user: {
          id: payload.sub || payload.id,
          email: payload.email,
          name: payload.name,
        },
      })
    } catch {
      throw new UnauthorizedException('Invalid token')
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
