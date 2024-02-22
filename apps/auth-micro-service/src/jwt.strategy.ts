import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: (request, rawJwtToken, done) => {
        console.log({ secretOrKey: configService.get<string>('SICRET_KEY') });
        done(null, configService.get<string>('SICRET_KEY'));
      },
    });
  }

  async validate(payload) {
    return { id: payload.sub, user: payload.user };
  }
}
