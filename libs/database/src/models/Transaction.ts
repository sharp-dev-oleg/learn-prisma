
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transaction{
    @PrimaryGeneratedColumn()
    id: number;
    @Column({name:'correspondent_name'})
    correspondentName: string;
    @Column()
    status: string;
    @Column({ type: 'decimal', precision: 13, scale: 2 })
    amount: number;
    @Column({name:'from_wailet_id'})
    fromWailetId: number;
    @Column({name:'to_wailet_id'})
    toWailetId: number;
    @Column({ type: 'decimal', precision: 13, scale: 2 })
    fromBalance: number;
    @Column({ type: 'decimal', precision: 13, scale: 2 })
    toBalance: number;
    @Column()
    date: Date;


}