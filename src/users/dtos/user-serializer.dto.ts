import { Expose } from "class-transformer";

export class UserSerializerDto{
    @Expose()
    id?: string;

    @Expose()
    name?: string;

    @Expose()
    currency?: string;

    @Expose()
    signature: string;

    @Expose()
    email: string;
}