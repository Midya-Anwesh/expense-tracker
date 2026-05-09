import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserLoginDto } from './dtos/user-login.dto';
import { hash, verify } from 'argon2';
import { UserSignupDto } from './dtos/user-signup.dto';
import type { Request as ExpressRequest } from 'express';
import { UserUpdateMailDto } from './dtos/user-update-mail.dto';
import { TokenService } from './jwt/token.service';
import { UpdatePasswordDto } from './dtos/update-password.dto';

declare global {
    namespace Express {
        interface Request {
            currUser: {
                id: string;
                tokenIdentifier: string;
            }
        }
    }
}

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private tokenService: TokenService
    ){}

    async whoami(currUser: ExpressRequest["currUser"]){
        return this.usersService.getUserById(currUser.id);
    }

    async verifyPassword(digest: string, password: string){
        if (! (await verify(digest, password))){
            throw new BadRequestException(`Mail or password is wrong`);
        }
        return;
    }

    async validateUser(email: string, password: string){                     
        const user = await this.usersService.getUserByEmail(email);
        if (!user){
            throw new NotFoundException(`No user found with email: ${email}`);          
        }  
        await this.verifyPassword(user.password, password);
        return user;
    }

    async login(userObj: UserLoginDto){
        // Validate the user & create a signed token
        const user = await this.validateUser(userObj.email, userObj.password);
        const signedUser = await this.tokenService.signUser(user);

        // Save the token & return it
        await this.tokenService.saveToken(
            signedUser.tokenIdentifier,
            user
        );
        return signedUser;
    }

    async signup(userObj: UserSignupDto){
        const user = await this.usersService.getUserByEmail(userObj.email);
        if (user){
            throw new BadRequestException(`User already exists with mail: ${userObj.email}`);
        }
        userObj.password = await hash(userObj.password);
        return this.usersService.createUser(userObj);
    }

    async changeEmail(updateObj: UserUpdateMailDto, currUser: ExpressRequest["currUser"]){

        const user = await this.usersService.getUserById(currUser.id);
        if (! user){
            throw new BadRequestException(` Please login..... `);
        }
        
        if (updateObj.email !== user.email){
            throw new BadRequestException(`User can update their own email address only`);
        }

        // Verify the user password
        await this.verifyPassword(user.password, updateObj.password);

        // Check if there is another user registered with the updated email
        // If yes don't update the email address
        if (await this.usersService.getUserByEmail(updateObj.newEmail)){
            throw new BadRequestException(`Request email address is already linked with other registered user`);
        }

        // Otherwise update the email
        // First block user's current token
        await this.tokenService.blockToken(currUser.tokenIdentifier, currUser.id);

        // now update their email and save
        user.email = updateObj.newEmail;
        await this.usersService.createUser(user);

        // Now generate and save and return new jwt token
        return await this.login({
            email: updateObj.newEmail,
            password: updateObj.password
        });
    }

    async signout(currUser: ExpressRequest["currUser"], all: Boolean = false){
        return await this.tokenService.blockToken(currUser.tokenIdentifier, currUser.id, all);
    }

    async updatePassword(passwordUpdateObj: UpdatePasswordDto, currUser: ExpressRequest["currUser"]){
        const user = await this.usersService.getUserByEmail(passwordUpdateObj.email);
        if (!user){
            throw new NotFoundException(`No users found with email: ${passwordUpdateObj.email}`);
        }
        if (user.id !== currUser.id){
            throw new BadRequestException(`Users may update their own password only`);
        }

        // Verify old password
        await this.verifyPassword(user.password, passwordUpdateObj.oldPassword);

        // Block current token for the user
        await this.tokenService.blockToken(currUser.tokenIdentifier, currUser.id);

        // Update password and save in db
        user.password = await hash(passwordUpdateObj.newPassword);
        await this.usersService.createUser(user);

        // Now log the user back in
        return await this.login({
            email: passwordUpdateObj.email,
            password: passwordUpdateObj.newPassword
        });
    }

    async deleteUser(currUser: ExpressRequest["currUser"]){
        // First block all the tokens sent to the user
        await this.tokenService.blockToken('', currUser.id, true);

        // Now hand over deletion to users service
        return await this.usersService.deleteUser(currUser.id);
    }
}
