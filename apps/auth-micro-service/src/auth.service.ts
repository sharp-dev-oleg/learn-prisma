import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { getClientPipeOperators } from '@app/utils/pipe';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_CLIENT')
    private readonly client: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    try {
      const user = await firstValueFrom(
        this.client
          .send<User>({ role: 'user', cmd: 'getWithPassword' }, username)
          .pipe(...getClientPipeOperators()),
      );

      if (user != null && compareSync(password, (user as User)?.password)) {
        return user;
      } else {
        throw new Error('Unauthorized');
      }
    } catch (e) {
      Logger.log(e);
      throw e;
    }
  }

  login(user: User) {
    const { username, id } = user;
    const payload = { user: { username, id }, sub: user.id };
    return {
      userId: user.id,
      accessToken: this.jwtService.sign(payload),
    };
  }

  validateToken(jwt: string) {
    return this.jwtService.verify(jwt);
  }

  getUserData(jwt: string) {
    const {
      user: { id, username },
      exp,
    } = this.jwtService.decode(jwt) as any;

    return { id, username, exp };
  }
}
