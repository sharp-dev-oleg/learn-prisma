import { User } from '@prisma/client';

export type AuthUser = Pick<User, 'password' | 'username'>;

export type PublicUser = Omit<User, 'password' | 'email'>;
