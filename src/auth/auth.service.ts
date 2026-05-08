import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserLoginDto } from './dtos/user-login.dto';
import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { Users } from '../users/Users.entity';
import { UserSignupDto } from './dtos/user-signup.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtList } from './JWTList.entity';
import { Repository } from 'typeorm';
import type { Request as ExpressRequest } from 'express';
import { UserUpdateMailDto } from './dtos/user-update-mail.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        @InjectRepository(JwtList) private jwtRepo: Repository<JwtList>
    ){}

    private async signUser(user: Users){
        const payload = {
            id: user.id,
            email: user.email
        }
        const signature = await this.jwtService.signAsync(payload);
        return Object.assign(payload, {signature});
    }

    async login(userObj: UserLoginDto){
        const user = await this.usersService.validateUser(userObj.email, userObj.password);
        const signedUser = await this.signUser(user);
        const jwtObj = this.jwtRepo.create({
            token: signedUser.signature,
            blockListed: false,
            user: user
        });

        await this.jwtRepo.save(jwtObj);
        return signedUser;
    }

    async signup(userObj: UserSignupDto){
        const user = await this.usersService.getUser(userObj.email);
        if (user){
            throw new BadRequestException(`User already exists with mail: ${userObj.email}`);
        }
        userObj.password = await hash(userObj.password);
        return this.usersService.createUser(userObj);
    }


    private async blockToken(userId: string, token: string){
        const TokenEntry = await this.jwtRepo.createQueryBuilder('jwt')
                            .innerJoin('jwt.user', 'user')
                            .select([
                                'jwt.id',
                                'jwt.token',
                                'jwt.blockListed as blockListed',
                                'user.id'
                            ])
                            .where('user.id = :userId', {userId})
                            .andWhere('jwt.token = :token', {token})
                            .getOne();
        
        if (!TokenEntry){
            throw new BadRequestException(`No valid token found to block`);
        }

        TokenEntry.blockListed = true;
        await this.jwtRepo.save(TokenEntry);
    }

    async changeEmail(updateObj: UserUpdateMailDto, currUser: ExpressRequest["currUser"]){
        if (updateObj.email !== currUser.email){
            throw new BadRequestException(`User can update their own email address only`);
        }

        // Verify the user
        const user = await this.usersService.validateUser(updateObj.email, updateObj.password);

        // Check if there is another user registered with the updated email
        // If yes don't update the email address
        if (await this.usersService.getUser(updateObj.newEmail)){
            throw new BadRequestException(`Request email address is already linked with other registered user`);
        }

        // Otherwise update the email
        // First block user's current token
        this.blockToken(user.id, currUser.token);

        // now update their email and save
        user.email = updateObj.newEmail;
        await this.usersService.createUser(user);

        // Now generate and save and return new jwt token
        return this.login({
            email: updateObj.newEmail,
            password: updateObj.password
        });
    }

    async signout(currUser: ExpressRequest["currUser"]){
        const user = await this.usersService.getUser(currUser.id);
        this.blockToken( currUser.id, currUser.token );
        return `blocked token ${currUser.token}`;
    }

    async isBlocked(userId: string, token: string){
        const tokenEntry = await this.jwtRepo.createQueryBuilder('jwt')
                            .innerJoin('jwt.user', 'user')
                            .where('user.id = :userId', {userId})
                            .andWhere('jwt.token = :token', {token})
                            .select([
                                'jwt.id',
                                'jwt.blockListed',
                                'user.id'
                            ])
                            .getOne();
        if (!tokenEntry){
            return true;
        }
        return tokenEntry.blockListed;
    }
}
