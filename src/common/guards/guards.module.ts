import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../../auth/auth.module';

@Module({
    imports: [JwtModule, AuthModule]
})
export class GuardsModule {}
