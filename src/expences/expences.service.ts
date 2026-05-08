import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Expences } from './expences.entity';
import { InjectRepository } from '@nestjs/typeorm';
import type { Request as ExpressRequest } from 'express';
import { CreateExpenceDto } from './dtos/create-expence.dto';
import { Users } from '../users/Users.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class ExpencesService {
    constructor(
        @InjectRepository(Expences) private expencesRepo: Repository<Expences>,
        private usersService: UsersService
    ){}

    async createLog(expenceObj: CreateExpenceDto, currUser: ExpressRequest["currUser"]){
        const user = await this.usersService.getUser(currUser.email);
        if (!user){
            throw new BadRequestException(`Please login to proceed`);
        }
        if (!expenceObj.date){
            expenceObj.date = new Date();
        }
        const expense = this.expencesRepo.create({
            ...expenceObj,
            users: user
        });
        return await this.expencesRepo.save(expense);
    }
}
