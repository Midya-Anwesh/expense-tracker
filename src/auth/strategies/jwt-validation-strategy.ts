import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TokenService } from "../jwt/token.service";
import type { Request as ExpressRequest } from "express";

@Injectable()
export class JwtValidationStrategy extends PassportStrategy(Strategy){
    constructor(
        configService: ConfigService,
        private tokenService: TokenService

    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: configService.get<string>("jwt_secret") ?? "default",
        })
    }

    async validate(payload: ExpressRequest["currUser"]) {
        if (await this.tokenService.isBlocked(payload.tokenIdentifier, payload.id)){
            throw new BadRequestException(`Token not valid, Please Login...`);
        }
        return payload;
    }
}