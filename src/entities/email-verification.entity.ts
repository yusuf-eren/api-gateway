import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("email_verifications")
export class EmailVerification {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    email: string

    @Column({ nullable: true })
    verificationCode: string

    @Column({ nullable: true })
    verificationToken: string

    @Column()
    expiresAt: Date

}