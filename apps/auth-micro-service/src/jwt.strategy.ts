import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { jwtConstants } from "./constants";

export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        //secretOrKey: jwtConstants.secret,
        ignoreExpiration: false,
        secretOrKeyProvider:function (request, rawJwtToken, done) {
          done(null,jwtConstants.secret)
      }
      });
    }
  
    async validate(payload) {
      return { id: payload.sub, user: payload.user};
    }
  }