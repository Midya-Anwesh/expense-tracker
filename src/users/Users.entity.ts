import { JwtList } from "../auth/JWTList.entity";
import { Expences } from "../expences/expences.entity";
import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToMany } from "typeorm";

@Entity()
@Unique('unique_email', ['email'])
export class Users{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
        length: 50,
        nullable: false
    })
    name: string;

    @Column({ unique: true, nullable: false })
    email: string;

    @Column()
    password: string;

    @Column()
    currency: string;

    @OneToMany(() => Expences, (expence) => expence.users)
    expences: Expences[];

    @OneToMany(() => JwtList, (jwtList) => jwtList.user)
    tokens: JwtList[];
}