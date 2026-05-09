import { Body, Controller, Patch, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserAuthGuard } from 'src/common/guards/user-auth.guard';
import { UsersUpdateDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import type { Request as ExpressRequest } from 'express';
import { UserSerializeInterceptor } from './interceptors/user-serializer.interceptor';

@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService
    ){}

    @UseInterceptors(UserSerializeInterceptor)
    @UseGuards(UserAuthGuard)
    @Patch('update')
    updateUser(@Body() updateObj: UsersUpdateDto, @Req() req: ExpressRequest){
        return this.usersService.updateUser(updateObj, req.currUser);
    }
}
