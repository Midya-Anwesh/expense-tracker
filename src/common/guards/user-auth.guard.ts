import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";

@Injectable()
export class UserAuthGuard extends AuthGuard('jwt'){
    constructor(
        private reflector: Reflector
    ){
        super({
            property: "currUser"
        });
    }
    
    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<Boolean>('Public', [
            context.getHandler(),
            context.getClass()
        ]);
        if (isPublic){
            return true;
        }
        return super.canActivate(context);
    }
}