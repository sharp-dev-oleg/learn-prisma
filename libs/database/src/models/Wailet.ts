
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Wailet{
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column({ type: 'decimal', precision: 13, scale: 2 })
    balance: number;
    @Column({name:'user_id'})
    userId: number;
    
}