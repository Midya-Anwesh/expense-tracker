import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Expences } from './expences.entity';
import { InjectRepository } from '@nestjs/typeorm';
import type { Request as ExpressRequest } from 'express';
import { CreateExpenceDto } from './dtos/create-expence.dto';
import { UsersService } from '../users/users.service';
import { UpdateExpenceDto } from './dtos/update-expence.dto';

@Injectable()
export class ExpencesService {
    constructor(
        @InjectRepository(Expences) private expencesRepo: Repository<Expences>,
        private usersService: UsersService
    ){}

    async createLog(expenceObj: CreateExpenceDto, currUser: ExpressRequest["currUser"]){
        const user = await this.usersService.getUserById(currUser.id);
        if (!user){
            throw new BadRequestException(`Please login to proceed`);
        }
        // Change the date from string to Date type
        // If given, then convert otherwise use current date
        if (expenceObj.date){
            expenceObj.date = new Date(expenceObj.date);
            // If wrong date is given in correct format, set current date
            if (expenceObj.date.toString() === "Invalid Date"){
                expenceObj.date = new Date();
            }
        }
        else {
            expenceObj.date = new Date();
        }
        const expense = this.expencesRepo.create({
            ...expenceObj,
            users: user
        });
        return await this.expencesRepo.save(expense);
    }

    async monthlyAnalysis(currUser: ExpressRequest["currUser"]){
        const user = await this.usersService.getUserById(currUser.id);
        if (!user){
            throw new BadRequestException(`Please login again`);
        }
        const res = await this.expencesRepo.find({
            where: {
                users: user
            }
        });

        const report = {};
        for (const expence of res){
            const date = new Date(expence.date);
            const currYear = date.getFullYear();
            const currMonth = date.getMonth() + 1; // As months are 0 indexed in js
            const currCat = expence.category;

            if (! (currYear in report)){
                report[currYear] = {};
            }
            if (! (currMonth in report[currYear]) ){
                report[currYear][currMonth] = {};
            }
            if (! (currCat in report[currYear][currMonth])){
                report[currYear][currMonth][currCat] = 0;
            }
            report[currYear][currMonth][currCat] += Number(expence.amount);
        }

        return report;
    }

    async updateLog(expenceId: string, currUser: ExpressRequest["currUser"], updateObj: UpdateExpenceDto){
        const expence = await this.expencesRepo.createQueryBuilder('expences')
        .innerJoin('expences.users', 'users')
        .where('expences.id = :expenceId', {expenceId})
        .select('expences')
        .addSelect('users.id')
        .getOne();
        if (!expence){
            throw new NotFoundException(`No expence log found with id: ${expenceId}`);
        }
        if (expence.users.id !== currUser.id){
            throw new BadRequestException(`Users can only modify their own logs`);
        }

        const updatedExpence = Object.assign(expence, updateObj);
        const toSave = this.expencesRepo.create(updatedExpence);
        return await this.expencesRepo.save(toSave);
    }

    async deleteLog(expenceId: string, currUser: ExpressRequest["currUser"]){
        const expence = await this.expencesRepo.findOne({
            where: {id: expenceId},
            relations: {users: true},
            select: {
                id: true,
                users: {
                    id: true
                }
            }
        });

        
        if (!expence){
            throw new NotFoundException(`No expence found with id: ${expenceId}`);
        }
        if (expence.users.id !== currUser.id){
            throw new BadRequestException(`Users Can only delete their logs`);
        }

        return await this.expencesRepo.remove(expence);
    }

    async dashboard(currUser: ExpressRequest["currUser"]){
        const res = await this.expencesRepo.createQueryBuilder('expence')
                    .innerJoin('expence.users', 'user')
                    .select([
                        'expence.category',
                        'user.name',
                        'user.email'
                    ])
                    .where('user.id = :userId', {userId: currUser.id})
                    .groupBy('expence.category, user.name, user.email')
                    .addSelect([
                        'SUM(expence.amount) AS "Total Spent"'
                    ])
                    .getRawMany();
                    
        if (!res.length){
            return [];
        }
        return  {
            name: res[0]["user_name"],
            email: res[0]["user_email"],
            spendings: res.map((expenditure) => {
                return {
                    expense_category: expenditure["expence_category"],
                    'Total Spent': expenditure["Total Spent"] 
                }
            })
        };
    }

    async findQuery(query: string, currUser: ExpressRequest["currUser"]){
        return await this.expencesRepo.createQueryBuilder('expences')
                    .where('note LIKE :term', {term: `%${query}%`})
                    .andWhere('usersId = :userId', {userId: currUser.id})
                    .getRawMany();
    }

    async categorySummary(catName: string | undefined){
        const query = this.expencesRepo.createQueryBuilder('expences')
                .groupBy('category')
                .select([
                    'category',
                    'COUNT(expences.id) AS "Times bought"',
                    'SUM(amount) AS "Total Spent"'
                ]);
        
        if (!catName){
            return await query.getRawMany();
        }
        return await query
                .where('category = :catName', {catName})
                .getRawMany();
    }
}
