import { IsEmail } from "class-validator";
import { UserLoginDto } from "./user-login.dto";

export class UserUpdateMailDto extends UserLoginDto {
    @IsEmail()
    newEmail: string;
}