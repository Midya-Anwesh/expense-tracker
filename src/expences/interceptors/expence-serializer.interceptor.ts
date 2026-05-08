import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { plainToClass } from "class-transformer";
import { ExpenceSerializerDto } from "../dtos/expence-serializer.dto";

export class ExpenceSerializer implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(
            map((data) => {
             return plainToClass(ExpenceSerializerDto, data, {excludeExtraneousValues: true});  
            })
        )
    }
}