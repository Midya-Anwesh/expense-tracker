import { Users } from "../../users/Users.entity";
import { Entity, Column, Unique, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

@Entity()
@Unique('user_token_unique', ['user', 'tokenIdentifier'])
export class JwtList {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("uuid")
    tokenIdentifier: string;

    @Column("boolean", {default: false})
    blockListed: Boolean;

    @ManyToOne(() => Users, (user) => user.tokens)
    user: Users;
}