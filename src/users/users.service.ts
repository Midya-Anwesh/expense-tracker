import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm' ;
import { Users } from './Users.entity';
import { UserSignupDto } from '../auth/dtos/user-signup.dto';
import { UsersUpdateDto } from './dtos/update-user.dto';
import { Request as ExpressRequest } from 'express';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users) private userRepo: Repository<Users>
    ){}                                                             

    async getUserByEmail(email: string){
        return await this.userRepo.findOneBy({email});
    }

    async getUserById(id: string){
        return await this.userRepo.findOneBy({id});
    }

    async createUser(user: UserSignupDto | Users){
        if (user instanceof Users){                          
            return await this.userRepo.save(user);
        }
        const newUser = this.userRepo.create(user);
        return await this.userRepo.save(newUser);
    }

    async updateUser(updateObj: UsersUpdateDto, currUser: ExpressRequest["currUser"]){
        const user = await this.getUserById(currUser.id);
        if (!user){
            throw new BadRequestException(`Please login again...`);
        }
        const updatedUser = this.userRepo.create(
            Object.assign(user, updateObj)
        );
        return await this.userRepo.save(updatedUser);

    }

    async deleteUser(userId: string){
        const user = await this.getUserById(userId);
        if (!user){
            throw new NotFoundException(`No user found with id: ${userId}`);
        }

        return await this.userRepo.remove(user);
    }
}
