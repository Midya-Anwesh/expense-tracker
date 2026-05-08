import { Matches, IsNumber, IsString, Min, MinLength, IsIn } from "class-validator";

export class CreateExpenceDto{
    @IsNumber()
    @Min(1)
    amount: number;

    @IsString()
    @IsIn(["FOOD", "BVG"])
    category: string;

    @IsString()
    @MinLength(1)
    note: string;

    date: Date;
}