import * as WebSocket from 'ws';
import { EventEmitter } from 'events';

import { login } from './actions';
import { Commands, SocketEvents, SocketPayloadsMap } from './types';

export interface IUWaveOptions {
  authImmediately?: boolean;
  credentials?: {
    email: string;
    password: string;
  };
  apiBaseUrl: string;
  wsConnectionString: string;
}

export class uWave {
  private jwt?: string;
  private socketToken?: string;
  private socket?: WebSocket;
  private emitter: EventEmitter;
  public options: IUWaveOptions;

  static KEEP_ALIVE_MESSAGE = '-';

  constructor(options: IUWaveOptions) {
    this.options = options;
    this.emitter = new EventEmitter();

    if (!process.env.UWAVE_API_BASE_URL) {
      process.env.UWAVE_API_BASE_URL = options.apiBaseUrl;
    }

    if (options.authImmediately && options.credentials) {
      const credentials = options.credentials;
      delete this.options.credentials;

      this.login(credentials.email, credentials.password).then(() =>
        this.connect()
      );
    }
  }

  public get isConnected() {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  public login(email: string, password: string) {
    return login(email, password).then((res) => {
      this.jwt = res.meta.jwt;
      this.socketToken = res.meta.socketToken;

      this.jwt;
      this.socketToken;

      this.emit('login');

      return res.data;
    });
  }

  public connect() {
    return this.connectSocket(this.options.wsConnectionString);
  }

  public once<E extends Commands>(
    eventName: E,
    listener: (payload: SocketPayloadsMap[E]) => void
  ) {
    return this.emitter.on(eventName, listener);
  }

  public on<E extends Commands>(
    eventName: E,
    listener: (payload: SocketPayloadsMap[E]) => void
  ) {
    return this.emitter.on(eventName, listener);
  }

  public off<E extends Commands>(
    eventName: E,
    listener: (payload: SocketPayloadsMap[E]) => void
  ) {
    return this.emitter.off(eventName, listener);
  }

  public sendChat(message: string) {
    return this.send({ command: 'sendChat', data: message });
  }

  public vote(direction: 1 | -1) {
    return this.send({ command: 'vote', data: direction });
  }

  public logout() {
    return this.send({ command: 'logout' });
  }

  private connectSocket(connectionString: string) {
    this.socket = new WebSocket(connectionString);

    this.socket.onopen = this.onSocketOpen.bind(this);
    this.socket.onclose = this.onSocketClose.bind(this);
    this.socket.onerror = this.onSocketError.bind(this);
    this.socket.onmessage = this.onSocketMessage.bind(this);
  }

  private onSocketOpen(/* event: WebSocket.OpenEvent */) {
    this.emit('connected');

    if (this.socketToken && this.socket && this.isConnected) {
      this.socket.send(this.socketToken);
    }
  }

  private onSocketClose(event: WebSocket.CloseEvent) {
    this.emit('disconnected');
    console.log('closed', event);
  }

  private onSocketError(event: WebSocket.ErrorEvent) {
    this.emit('error');
    console.log('error', event);
  }

  private onSocketMessage(event: WebSocket.MessageEvent) {
    if (event.data === uWave.KEEP_ALIVE_MESSAGE) return;
    if (typeof event.data !== 'string') return;

    let payload: SocketEvents;

    try {
      payload = JSON.parse(event.data);
    } catch (err) {
      console.error(err);
      return;
    }

    switch (payload.command) {
      default:
        this.emit(payload.command, payload.data);
        break;
    }
  }

  private emit<I>(command: Commands, payload?: I) {
    return this.emitter.emit(command, payload);
  }

  private send<I>(message: I) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;

    return this.socket.send(JSON.stringify(message));
  }
}
