import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('user_infos')
export class Info {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    smsPermitted: boolean

    @Column()
    emailPermitted: boolean

    @Column({ nullable: true, default: false })
    freeTest: boolean

    @Column({ nullable: true, default: false })
    isOnline: boolean

    @Column({ nullable: false, default: true })
    isActive: boolean

    @OneToOne(() => User)
    @JoinColumn()
    user: User
}