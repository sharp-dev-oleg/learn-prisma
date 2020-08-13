
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transaction{
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    status: string;
    @Column({ type: 'decimal', precision: 13, scale: 2 })
    amount: number;
    @Column({name:'from_wailet_id'})
    fromWailetId: number;
    @Column({name:'to_wailet_id'})
    toWailetId: number;
    

}