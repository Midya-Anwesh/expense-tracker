import { IsNumber, IsString, Min, MinLength, IsIn, Matches, IsOptional } from "class-validator";
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

    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Enter date in YYYY-MM-DD format or leave blank for current date"
    })
    @IsOptional()
    date: string | Date;
}