
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Wailet{
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    balance: number;
    @Column({name:'user_id'})
    userId: number;
    
}