import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { JwtService } from "@nestjs/jwt";
import { Injectable } from "@nestjs/common";
import type { Request as ExpressRequest } from "express";
import { TokenService } from "../../auth/jwt/token.service";

@Injectable()
export class UserAuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private tokenService: TokenService
    ){}
    async canActivate(context: ExecutionContext){
        const req: Request = context.switchToHttp().getRequest();
        const token = req.headers.authorization?.split(' ')[1];
        if (!token){
            return false;
        }
        const payload: ExpressRequest["currUser"] = await this.jwtService.verifyAsync(token);
        if (await this.tokenService.isBlocked(payload.tokenIdentifier, payload.id)){
            return false;
        }
        req.currUser = {...payload};
        return true;
    }
}