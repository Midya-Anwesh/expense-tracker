import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserLoginDto } from './dtos/user-login.dto';
import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { Users } from '../users/Users.entity';
import { UserSignupDto } from './dtos/user-signup.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
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
        const user = await this.usersService.getUser(userObj.email);
        if (!user){
            throw new BadRequestException(`No user found with provided emal: ${userObj.email}`);
        }
        if ( !(verify(user.password, userObj.password)) ){
            throw new BadRequestException(`Invalid email or password`);
        }
        return this.signUser(user);
    }

    async signup(userObj: UserSignupDto){
        const user = await this.usersService.getUser(userObj.email);
        if (user){
            throw new BadRequestException(`User already exists with mail: ${userObj.email}`);
        }
        userObj.password = await hash(userObj.password);
        return this.usersService.createUser(userObj);
    }
}
