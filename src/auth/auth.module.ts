import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { TokenModule } from './jwt/token.module';
import { PassportModule } from '@nestjs/passport';
import { JwtValidationStrategy } from './strategies/jwt-validation-strategy';

@Module({
  imports: [UsersModule, TokenModule],
  providers: [AuthService, 
    JwtValidationStrategy
  ],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
