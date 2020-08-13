import { CanActivate, Inject, ExecutionContext, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import {timeout} from 'rxjs/operators'

export class AuthWSGuard implements CanActivate {
    constructor(
      @Inject('AUTH_CLIENT')
      private readonly client: ClientProxy
    ) {}
  
    async canActivate(
      context: ExecutionContext,
    ): Promise<boolean> {
      Logger.log("ws.canActivate");
      const req = context.switchToWs().getClient();
          
      try{
        const res = await this.client.send(
          { role: 'auth', cmd: 'check' },
          { jwt: req.handshake.headers['authorization']?.split(' ')[1]})
          .pipe(timeout(5000))
          .toPromise<boolean>();
  
          return res;
      } catch(err) {
        Logger.error(err);
        return false;
      }
    }

   

    
  }