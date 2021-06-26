import * as WebSocket from 'ws';
import { EventEmitter } from 'events';

import { PrivateTokenRef, uWave } from '..';
import { Commands, SocketEvents, SocketPayloadsMap } from '../types';

let privateTokenRef: PrivateTokenRef = {};

export default class Socket {
  private uw: uWave;

  private socket?: WebSocket;
  private emitter: EventEmitter;

  static KEEP_ALIVE_MESSAGE = '-';

  constructor(uw: uWave, tokenRef: PrivateTokenRef) {
    this.uw = uw;
    this.emitter = new EventEmitter();

    privateTokenRef.token = tokenRef.token;
  }

  // #region socket
  public get isConnected() {
    return this.socket?.readyState === WebSocket.OPEN;
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

  public connect() {
    return this.connectSocket(this.uw.options.wsConnectionString);
  }

  public disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }

  public emit<E extends Commands>(command: E, payload?: SocketPayloadsMap[E]) {
    return this.emitter.emit(command, payload);
  }

  public send<I>(message: I) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;

    return this.socket.send(JSON.stringify(message));
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

    if (!privateTokenRef.token && this.uw.isAuthenticated) {
      privateTokenRef.token = await this.uw.auth.getSocketToken();
    }

    if (privateTokenRef.token) {
      this.socket.send(privateTokenRef.token);

      // the token is expired after being validated
      delete privateTokenRef.token;
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
  // #endregion
}
