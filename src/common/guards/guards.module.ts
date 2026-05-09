import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../../auth/auth.module';
import { TokenModule } from '../../auth/jwt/token.module';

@Module({
    imports: [JwtModule, AuthModule, TokenModule]
})
export class GuardsModule {}
