import {
  Controller,
  Get,
  Post,
  Body,
  Headers,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthService } from './auth.service'

interface VerifyTokenDto {
  token: string
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('verify')
  async verifyToken(@Body() verifyTokenDto: VerifyTokenDto) {
    return await this.authService.verifyToken(verifyTokenDto.token)
  }

  @Get('me')
  async getUserInfo(@Headers('authorization') authorization: string) {
    if (!authorization) {
      throw new UnauthorizedException('Authorization header is required')
    }

    const token = authorization.replace('Bearer ', '')
    return await this.authService.getUserInfo(token)
  }

  @Post('validate')
  async validateUser(@Body() verifyTokenDto: VerifyTokenDto) {
    const user = await this.authService.validateUser(verifyTokenDto.token)
    return { valid: !!user, user }
  }
}
