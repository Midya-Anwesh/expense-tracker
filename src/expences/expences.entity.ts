import { Users } from "../users/Users.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

@Entity()
export class Expences {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("decimal")
    amount: number;

    @Column()
    note: string;

    @Column()
    category: string;

    @Column("date", {nullable: false})
    date: Date;

    @ManyToOne(() => Users, (user) => user.expences)
    users: Users;
}