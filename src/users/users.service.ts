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
}
