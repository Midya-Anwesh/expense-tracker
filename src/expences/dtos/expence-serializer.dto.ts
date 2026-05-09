import { Expose, Type } from "class-transformer";
import { UserSerializerDto } from "../../users/dtos/user-serializer.dto";
import { Users } from "../../users/Users.entity";

export class ExpenceSerializerDto {
    @Expose()
    id: string;

    @Expose()
    note: string;

    @Expose()
    name: string;

    @Expose()
    category: string;

    @Expose()
    date: Date;

    @Expose()
    @Type(() => UserSerializerDto)
    users: Users;
}