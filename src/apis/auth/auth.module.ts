import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { SupabaseAuthProvider } from './strategies/supabase-auth.provider'
import { JwtAuthProvider, JWT_SECRET } from './strategies/jwt-auth.providers'

@Module({
  providers: [
    {
      provide: 'AUTH_PROVIDER',
      useClass: SupabaseAuthProvider, // 💡 여기만 바꾸면 전략 바뀜!
    },
    {
      provide: JWT_SECRET,
      useValue: process.env.JWT_SECRET || 'your-secret-key', // 환경변수 또는 기본값
    },
    SupabaseAuthProvider,
    JwtAuthProvider,
    AuthService,
  ],
  exports: ['AUTH_PROVIDER', AuthService],
})
export class AuthModule {}
