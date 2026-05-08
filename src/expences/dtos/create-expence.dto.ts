import { IsNumber, IsString, Min, MinLength } from "class-validator";

export class CreateExpenceDto{
    @IsNumber()
    @Min(1)
    amount: number;

    @IsString()
    @MinLength(1)
    note: string;
}