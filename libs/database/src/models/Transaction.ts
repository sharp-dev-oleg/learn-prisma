
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transaction{
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    status: string;
    @Column()
    anount: number;
    @Column()
    fromWailetId: number;
    @Column()
    toWailetId: number;
    

}