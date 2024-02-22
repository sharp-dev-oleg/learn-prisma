import { Transaction } from 'libs/database/src/models/Transaction';
import { Wailet } from 'libs/database/src/models/Wailet';

import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map, switchMap, take, filter } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import { UseGuards, Logger } from '@nestjs/common';
import { PwService } from '../services/pw.service';
import { AuthService } from '../services/auth.service';
import { AuthWSGuard } from '../guards/authws.guard';

@WebSocketGateway()
export class GetWayController
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  users: { [userId: number]: Socket } = {};

  constructor(
    private readonly service: PwService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(AuthWSGuard)
  @SubscribeMessage('get_my_wailets')
  getMyWailets(client: Socket): Observable<WsResponse<Array<Wailet>>> {
    return this.getUser(client.request).pipe(
      take(1),
      switchMap((user) => from(this.service.getWailets(user.id))),
      map((data) => ({ event: 'my_wailets', data })),
    );
  }

  handleConnection(client: Socket) {
    Logger.log(`new client(${client.id}) connected`);
    this.getUser(client.handshake)
      .pipe(
        take(1),
        filter((user) => user !== false),
      )
      .subscribe((user) => {
        Logger.log(`user: ${user.username} ${user.id} connected`);
        this.users[user.id] = client;
      });
  }

  handleDisconnect(client: Socket) {
    Logger.log(` client(${client.id}) disconnected`);
    this.getUser(client.handshake)
      .pipe(
        take(1),
        filter((user) => user !== false),
      )
      .subscribe((user) => {
        Logger.log(`user: ${user.username} ${user.id} disconnected`);
        if (this.users[user.id] !== undefined) delete this.users[user.id];
      });
  }

  @SubscribeMessage('update_transaction')
  async updateTransaction(@MessageBody() model: Transaction) {
    Logger.log('updateTransaction');
    Logger.log(model);
    const from = await this.service.getWailet(model.fromWailetId);
    Logger.log(from);
    const to = await this.service.getWailet(model.toWailetId);
    Logger.log(to);
    if (this.users[from.userId] !== undefined) {
      Logger.log(
        `send transaction update to ${from.userId} - ${this.users[from.userId].id}`,
      );
      this.users[from.userId].emit('update_my_transaction', model);
    } else Logger.log(`user(${from.userId}) not connected`);
    if (this.users[to.userId] !== undefined) {
      Logger.log(
        `send transaction update to ${to.userId} - ${this.users[to.userId].id}`,
      );
      this.users[to.userId].emit('update_my_transaction', model);
    } else Logger.log(`user(${to.userId}) not connected`);
  }

  @SubscribeMessage('update_wailet')
  updateWailet(@MessageBody() model: Wailet) {
    Logger.log('updateWailet');
    Logger.log(model);
    if (this.users[model.userId] != undefined)
      this.users[model.userId].emit('update_my_wailet', model);
    else Logger.log(`user(${model.userId}) not connected`);
  }

  getUser(req: any) {
    return from(
      this.authService.getUserData(req.headers['authorization']?.split(' ')[1]),
    );
  }
}
