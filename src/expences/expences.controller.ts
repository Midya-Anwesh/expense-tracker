import { Body, Controller, Post, Req, UseGuards, UseInterceptors, Get, Patch, Query, Delete } from '@nestjs/common';
import { ExpencesService } from './expences.service';
import { CreateExpenceDto } from './dtos/create-expence.dto';
import type { Request as ExpressRequest } from 'express';
import { UserAuthGuard } from '../common/guards/user-auth.guard';
import { ExpenceSerializer } from './interceptors/expence-serializer.interceptor';
import { UpdateExpenceDto } from './dtos/update-expence.dto';


@UseGuards(UserAuthGuard)
@Controller('expences')
export class ExpencesController {
    constructor(
        private expencesService: ExpencesService 
    ){}

    @UseInterceptors(ExpenceSerializer)
    @Post('create')
    createExpence(@Body() expenceObj: CreateExpenceDto, @Req() req: ExpressRequest){
        return this.expencesService.createLog(expenceObj, req.currUser);
    }

    @Get('monthly/analysis')
    getMonthlyAnalysis(@Req() req: ExpressRequest){
        return this.expencesService.monthlyAnalysis(req.currUser);
    }

    @UseInterceptors(ExpenceSerializer)
    @Patch('update')
    updateExpence(@Body() updateObj: UpdateExpenceDto, @Query('expenseId') expenseId: string, @Req() req: ExpressRequest){
        return this.expencesService.updateLog(expenseId, req.currUser, updateObj);
    }

    @UseInterceptors(ExpenceSerializer)
    @Delete('log')
    deleteExpence(@Query('expenseId') expenseId: string, @Req() req: ExpressRequest){
        return this.expencesService.deleteLog(expenseId, req.currUser);
    }

    @Get('dashboard')
    viewDashboard(@Req() req: ExpressRequest){
        return this.expencesService.dashboard(req.currUser);
    }

    @Get('find')
    findQuery(@Query('q') q: string, @Req() req: ExpressRequest){
        return this.expencesService.findQuery(q, req.currUser);
    }
}
