import { IsString, IsEmail, MaxLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @MaxLength(3)
    currency: string;
}