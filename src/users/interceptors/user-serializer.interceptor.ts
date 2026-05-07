import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { map } from "rxjs/operators";
import { plainToClass } from "class-transformer";
import { UserSerializerDto } from "../dtos/user-serializer.dto";

export class UserSerializeInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>) {
        return next.handle().pipe(
            map((data: any) => plainToClass(UserSerializerDto, data, {excludeExtraneousValues: true}))
        );
    }
}