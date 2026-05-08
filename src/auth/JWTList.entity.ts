import { Users } from "../users/Users.entity";
import { Entity, Column, Unique, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

@Entity()
@Unique('user_token_unique', ['user', 'token'])
export class JwtList {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("uuid")
    token: string;

    @Column("boolean")
    blockListed: Boolean;

    @ManyToOne(() => Users, (user) => user.tokens)
    user: Users;
}