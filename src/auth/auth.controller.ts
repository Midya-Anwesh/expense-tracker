import { Body, Controller, Post, UseGuards, UseInterceptors , Get, Req, Patch} from '@nestjs/common';
import { UserSignupDto } from './dtos/user-signup.dto';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dtos/user-login.dto';
import { UserSerializeInterceptor } from '../users/interceptors/user-serializer.interceptor';
import { UserAuthGuard } from '../common/guards/user-auth.guard';
import type { Request as ExpressRequest } from 'express';
import { UserUpdateMailDto } from './dtos/user-update-mail.dto';
@UseInterceptors(UserSerializeInterceptor)
@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService
    ){}

    @Post('signup')
    signup(@Body() userObj: UserSignupDto){
        return this.authService.signup(userObj);
    }

    @Post('login')
    async login(@Body() userObj: UserLoginDto){
        return this.authService.login(userObj);
    }

    @UseGuards(UserAuthGuard)
    @Get('whoami')
    whoami(@Req() req: ExpressRequest){
        return req.currUser.email;
    }

    @UseGuards(UserAuthGuard)
    @Patch('update/email')
    updateEmail(@Body() updateObj: UserUpdateMailDto, @Req() req: ExpressRequest){
        return this.authService.changeEmail(updateObj, req.currUser);
    }

}
