import { CanActivate, Inject, ExecutionContext, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import {timeout, catchError} from 'rxjs/operators'
import { GqlExecutionContext } from '@nestjs/graphql';

export class AuthGuard implements CanActivate {
    constructor(
      @Inject('AUTH_CLIENT')
      private readonly client: ClientProxy
    ) {}
  
    async canActivate(
      context: ExecutionContext,
    ): Promise<boolean> {
      const req = context.switchToHttp().getRequest();
  
      try{
        const res = await this.client.send(
          { role: 'auth', cmd: 'check' },
          { jwt: req.headers['authorization']?.split(' ')[1]})
          .pipe(timeout(5000))
          .toPromise<boolean>();
  
          return res;
      } catch(err) {
        Logger.error(err);
        return false;
      }
    }

   

    
  }