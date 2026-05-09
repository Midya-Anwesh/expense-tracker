import { Module } from '@nestjs/common';
import { ExpencesService } from './expences.service';
import { ExpencesController } from './expences.controller';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expences } from './expences.entity';
import { TokenModule } from '../auth/jwt/token.module';
import { AuthModule } from '../auth/auth.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([Expences]),
    UsersModule, TokenModule],
  providers: [ExpencesService],
  controllers: [ExpencesController]
})
export class ExpencesModule {}