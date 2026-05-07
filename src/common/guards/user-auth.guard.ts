import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { JwtService } from "@nestjs/jwt";
import { Injectable } from "@nestjs/common";

declare global {
    namespace Express {
        interface Request {
            currUser: {
                id: string;
                email: string;
            }
        }
    }
}

@Injectable()
export class UserAuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService
    ){}
    async canActivate(context: ExecutionContext){
        const req: Request = context.switchToHttp().getRequest();
        const token = req.headers.authorization?.split(' ')[1];
        if (!token){
            return false;
        }
        const payload = await this.jwtService.verifyAsync(token);
        req.currUser = payload;
        return true;
    }
}