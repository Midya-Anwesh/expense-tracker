import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ExpencesService } from './expences.service';
import { CreateExpenceDto } from './dtos/create-expence.dto';
import type { Request as ExpressRequest } from 'express';
import { UserAuthGuard } from '../common/guards/user-auth.guard';
@Controller('expences')
export class ExpencesController {
    constructor(
        private expencesService: ExpencesService 
    ){}

    @UseGuards(UserAuthGuard)
    @Post('create')
    createExpence(@Body() expenceObj: CreateExpenceDto, @Req() req: ExpressRequest){
        return this.expencesService.createLog(expenceObj, req.currUser);
    }
}
