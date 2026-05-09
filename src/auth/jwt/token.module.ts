import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtList } from './JWTList.entity';
import { UsersModule } from '../../users/users.module';
import { TokenService } from './token.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([JwtList]),
        UsersModule
    ],
    providers: [TokenService],
    exports: [
        TokenService
    ]
})
export class TokenModule {}
