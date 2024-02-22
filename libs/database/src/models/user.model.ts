import { IUser } from './user.interface';
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import { hash } from 'bcrypt';

@Entity()
export class UserModel implements IUser {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  username: string;
  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }
}
