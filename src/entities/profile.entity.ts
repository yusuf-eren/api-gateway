import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";


@Entity("user_profiles")
export class Profile {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: true })
    job: string

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    rate: number;

    @Column('text', { nullable: true })
    biography: string

    @Column({ nullable: true })
    youtubeUrl: string

    @Column({ nullable: true })
    skypeUrl: string

    @Column('text', { nullable: true })
    address: string

    @OneToOne(() => User)
    @JoinColumn()
    user: User

}