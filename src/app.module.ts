import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { APP_GUARD } from '@nestjs/core'
import { UsersModule } from './apis/users/users.module'
import { AuthModule } from './apis/auth/auth.module'
import { PostgresModule } from './databases/postgres/postgres.module'
import { LoggerModule } from './loggers/logger.module'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),
    LoggerModule,
    PostgresModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
