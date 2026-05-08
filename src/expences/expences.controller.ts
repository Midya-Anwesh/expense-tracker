import { Body, Controller, Post, Req, UseGuards, UseInterceptors, Get, Patch, Param, Query, Delete } from '@nestjs/common';
import { ExpencesService } from './expences.service';
import { CreateExpenceDto } from './dtos/create-expence.dto';
import type { Request as ExpressRequest } from 'express';
import { UserAuthGuard } from '../common/guards/user-auth.guard';
import { ExpenceSerializer } from './interceptors/expence-serializer.interceptor';
import { UpdateExpenceDto } from './dtos/update-expence.dto';


@Controller('expences')
export class ExpencesController {
    constructor(
        private expencesService: ExpencesService 
    ){}

    @UseInterceptors(ExpenceSerializer)
    @UseGuards(UserAuthGuard)
    @Post('create')
    createExpence(@Body() expenceObj: CreateExpenceDto, @Req() req: ExpressRequest){
        return this.expencesService.createLog(expenceObj, req.currUser);
    }

    @UseGuards(UserAuthGuard)
    @Get('monthly/analysis')
    getMonthlyAnalysis(@Req() req: ExpressRequest){
        return this.expencesService.monthlyAnalysis(req.currUser);
    }

    @UseInterceptors(ExpenceSerializer)
    @UseGuards(UserAuthGuard)
    @Patch('update')
    updateExpence(@Body() updateObj: UpdateExpenceDto, @Query('expenseId') expenseId: string, @Req() req: ExpressRequest){
        return this.expencesService.updateLog(expenseId, req.currUser, updateObj);
    }

    @UseInterceptors(ExpenceSerializer)
    @UseGuards(UserAuthGuard)
    @Delete('log')
    deleteExpence(@Query('expenseId') expenseId: string, @Req() req: ExpressRequest){
        return this.expencesService.deleteLog(expenseId, req.currUser);
    }
}
