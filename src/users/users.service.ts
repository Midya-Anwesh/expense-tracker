import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm' ;
import { Users } from './Users.entity';
import { UserSignupDto } from '../auth/dtos/user-signup.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users) private userRepo: Repository<Users>
    ){}

    async getUser(email: string){
        return await this.userRepo.findOneBy({email});
    }

    async createUser(user: UserSignupDto){
        const newUser = this.userRepo.create(user);
        return await this.userRepo.save(user);
    }
}
