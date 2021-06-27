import * as WebSocket from 'ws';
import { EventEmitter } from 'events';

import { PrivateSocketTokenRef, uWave } from '..';
import { Commands, SocketEvents, SocketPayloadsMap } from '../types';

const privateSocketTokenRef: PrivateSocketTokenRef = {};

export default class Socket {
  private uw: uWave;

  private socket?: WebSocket;
  private emitter: EventEmitter;

  static KEEP_ALIVE_MESSAGE = '-';

  constructor(uw: uWave, tokenRef: PrivateSocketTokenRef) {
    this.uw = uw;
    this.emitter = new EventEmitter();

    privateSocketTokenRef.token = tokenRef.token;
  }

  public get isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  public once<E extends Commands>(
    eventName: E,
    listener: (payload: SocketPayloadsMap[E]) => void
  ): EventEmitter {
    return this.emitter.on(eventName, listener);
  }

  public on<E extends Commands>(
    eventName: E,
    listener: (payload: SocketPayloadsMap[E]) => void
  ): EventEmitter {
    return this.emitter.on(eventName, listener);
  }

  public off<E extends Commands>(
    eventName: E,
    listener: (payload: SocketPayloadsMap[E]) => void
  ): EventEmitter {
    return this.emitter.off(eventName, listener);
  }

  public connect(): void {
    return this.connectSocket(this.uw.options.wsConnectionString);
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
    }
  }

  public emit<E extends Commands>(
    command: E,
    payload?: SocketPayloadsMap[E]
  ): boolean {
    return this.emitter.emit(command, payload);
  }

  public send<I>(message: I): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;

    this.socket.send(JSON.stringify(message));
  }

  private connectSocket(connectionString: string) {
    this.socket = new WebSocket(connectionString);

    this.socket.onopen = this.onSocketOpen.bind(this);
    this.socket.onclose = this.onSocketClose.bind(this);
    this.socket.onerror = this.onSocketError.bind(this);
    this.socket.onmessage = this.onSocketMessage.bind(this);
  }

  private async onSocketOpen(/* event: WebSocket.OpenEvent */) {
    this.emit('connected');

    if (!this.socket || !this.isConnected) return;

    if (!privateSocketTokenRef.token && this.uw.isAuthenticated) {
      privateSocketTokenRef.token = await this.uw.auth.getSocketToken();
    }

    if (privateSocketTokenRef.token) {
      this.socket.send(privateSocketTokenRef.token);

      // the token is expired after being validated
      delete privateSocketTokenRef.token;
    }
  }

  private onSocketClose(event: WebSocket.CloseEvent) {
    event.target.removeAllListeners();
    event.target.terminate();
    delete this.socket;

    this.emit('disconnected');
  }

  private onSocketError(/* event: WebSocket.ErrorEvent */) {
    this.emit('error');
  }

  private onSocketMessage(event: WebSocket.MessageEvent) {
    if (event.data === Socket.KEEP_ALIVE_MESSAGE) return;
    if (typeof event.data !== 'string') return;

    let payload: SocketEvents;

    try {
      payload = JSON.parse(event.data) as SocketEvents;
    } catch (err) {
      // console.error(err);
      return;
    }

    switch (payload.command) {
      default:
        this.emit(payload.command, payload.data);
        break;
    }
  }
}
