import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { JwtService } from "@nestjs/jwt";
import { Injectable } from "@nestjs/common";
import { AuthService } from "../../auth/auth.service";

declare global {
    namespace Express {
        interface Request {
            currUser: {
                id: string;
                email: string;
                token: string;
                name: string;
            }
        }
    }
}

@Injectable()
export class UserAuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private authService: AuthService
    ){}
    async canActivate(context: ExecutionContext){
        const req: Request = context.switchToHttp().getRequest();
        const token = req.headers.authorization?.split(' ')[1];
        if (!token){
            return false;
        }
        const payload = await this.jwtService.verifyAsync(token);
        if (await this.authService.isBlocked(payload.id, token)){
            return false;
        }
        req.currUser = {...payload, token};
        return true;
    }
}