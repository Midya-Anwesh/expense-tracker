import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { JwtList } from './JWTList.entity';
import { Users } from '../../users/Users.entity';
import { randomUUID } from 'crypto';



@Injectable()
export class TokenService {
    constructor(
        @InjectRepository(JwtList) private jwtRepo: Repository<JwtList>,
        private jwtService: JwtService
    ){}

    async signUser(user: Users){
        const payload = {
            id: user.id,
            tokenIdentifier: randomUUID(),
            email: user.email,
            name: user.name
        }
        const signature = await this.jwtService.signAsync(payload);
        return Object.assign(payload, {signature});
    }

    async saveToken(identifier: string, user: Users){
        const newTokenEntry = this.jwtRepo.create({
            tokenIdentifier: identifier,
            user: user
        });
        return await this.jwtRepo.save(newTokenEntry);
    }

    private async findTokenEntry(identifier: string, userId: string){
        return await this.jwtRepo.findOne({
            where: {
                tokenIdentifier: identifier,
                user: {
                    id: userId
                }
            },

            select: {
                id: true,
                blockListed: true,
                user: true
            }
        });
    }

    async isBlocked(identifier: string, userId: string){
        const res = await this.findTokenEntry(identifier, userId);

        if (!res){
            throw new BadRequestException(`No token entry found`);
        }

        return res.blockListed;
    }

    async blockToken(identifier: string, userId: string){
        const token = await this.findTokenEntry(identifier, userId);

        if (!token){
            throw new BadRequestException(`No token found to be blocked, requested identifier: ${identifier}, userid: ${userId}`);
        }

        token.blockListed = true;
        return await this.jwtRepo.save(token);
    }
}