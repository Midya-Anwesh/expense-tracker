import { PartialType, OmitType } from "@nestjs/swagger";
import { UserSignupDto } from "../../auth/dtos/user-signup.dto";

export class UsersUpdateDto extends PartialType(
    OmitType(
        UserSignupDto,
        [
            'email',
            'password',
        ]
    )
){}