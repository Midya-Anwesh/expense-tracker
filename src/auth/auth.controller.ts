import { Body, Controller, Post, UseGuards, UseInterceptors , Get, Req, Patch, Query, SetMetadata} from '@nestjs/common';
import { UserSignupDto } from './dtos/user-signup.dto';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dtos/user-login.dto';
import { UserSerializeInterceptor } from '../users/interceptors/user-serializer.interceptor';
import { UserAuthGuard } from '../common/guards/user-auth.guard';
import type { Request as ExpressRequest } from 'express';
import { UserUpdateMailDto } from './dtos/user-update-mail.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';


@UseGuards(UserAuthGuard)
@UseInterceptors(UserSerializeInterceptor)
@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService
    ){}

    @SetMetadata('Public', true)
    @Post('signup')
    signup(@Body() userObj: UserSignupDto){
        return this.authService.signup(userObj);
    }

    @SetMetadata('Public', true)
    @Post('login')
    async login(@Body() userObj: UserLoginDto){
        return this.authService.login(userObj);
    }

    @Get('whoami')
    whoami(@Req() req: ExpressRequest){
        return this.authService.whoami(req.currUser);
    }

    @Patch('update/email')
    updateEmail(@Body() updateObj: UserUpdateMailDto, @Req() req: ExpressRequest){
        return this.authService.changeEmail(updateObj, req.currUser);
    }

    @Patch('update/password')
    updatePassword(@Body() passwordUpdateObj: UpdatePasswordDto, @Req() req: ExpressRequest){
        return this.authService.updatePassword(passwordUpdateObj, req.currUser);
    }

    @Post('logout')
    logout(@Query('all') all: string | undefined,  @Req() req: ExpressRequest){
        if (all === 'true'){
            return this.authService.signout(req.currUser, true);
        }
        return this.authService.signout(req.currUser);
    }

}
