import { IsString, IsEmail, MaxLength } from "class-validator";

export class UserSignupDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsString()
    @MaxLength(3)
    currency: string;
}