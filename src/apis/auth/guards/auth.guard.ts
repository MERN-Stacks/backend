import { ExecutionContext } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import { CanActivate } from '@nestjs/common'
import { Inject } from '@nestjs/common'
import { IAuthProvider } from 'src/common/interfaces/auth.interface'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject('AUTH_PROVIDER') private authProvider: IAuthProvider) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    const token = req.headers.authorization?.replace('Bearer ', '')
    const user = await this.authProvider.verifyToken(token)
    req.user = user
    return true
  }
}
