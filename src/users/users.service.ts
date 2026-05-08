import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm' ;
import { Users } from './Users.entity';
import { UserSignupDto } from '../auth/dtos/user-signup.dto';
import { verify } from 'argon2';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users) private userRepo: Repository<Users>
    ){}                                                             

    async getUser(email: string){
        return await this.userRepo.findOneBy({email});
    }

    async createUser(user: UserSignupDto | Users){
        if (user instanceof Users){
            return await this.userRepo.save(user);
        }
        const newUser = this.userRepo.create(user);
        return await this.userRepo.save(newUser);
    }

    async validateUser(email: string, password: string){
        const user = await this.getUser(email);
        if (!user){
            throw new BadRequestException(`No user found with email: ${email}`);
        }
        if (! (await verify(user.password, password))){
            throw new BadRequestException(`Email or password is wrong`);
        }
        return user;
    }
}
