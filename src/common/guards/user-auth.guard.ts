import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class UserAuthGuard extends AuthGuard('jwt'){
    constructor(){
        super({
            property: "currUser"
        });
    }
}