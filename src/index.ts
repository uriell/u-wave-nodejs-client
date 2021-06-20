import * as WebSocket from 'ws';
import { EventEmitter } from 'events';
import fetch, { RequestInit } from 'node-fetch';

import { Commands, SocketEvents, SocketPayloadsMap } from './types';
import { Auth, Booth } from './modules';

export interface IUWaveOptions {
  apiBaseUrl: string;
  wsConnectionString: string;
  authImmediately?: boolean;
  credentials?: {
    email: string;
    password: string;
  };
}

export class uWave {
  private jwt?: string;
  private socketToken?: string;
  private socket?: WebSocket;
  private emitter: EventEmitter;
  public options: IUWaveOptions;

  // #region modules
  private modules: {
    auth?: Auth;
    booth?: Booth;
  } = {};
  // #endregion

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

      this.auth
        .login(credentials.email, credentials.password)
        .then(() => this.connect());
    }
  }

  get auth() {
    return (
      this.modules.auth ||
      (this.modules.auth = new Auth(this, (jwt, socketToken) => {
        this.jwt = jwt;
        this.socketToken = socketToken;
      }))
    );
  }

  get booth() {
    return this.modules.booth || (this.modules.booth = new Booth(this));
  }

  public sendChat(message: string) {
    return this.send({ command: 'sendChat', data: message });
  }

  public vote(direction: 1 | -1) {
    return this.send({ command: 'vote', data: direction });
  }

  // #region http
  public request<I extends {}, R extends {}>(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    endpoint: string,
    data?: I
  ): Promise<R> {
    const fetchOptions: RequestInit = { method };
    fetchOptions.headers = {};

    if (this.jwt) {
      fetchOptions.headers.Authorization = `JWT ${this.jwt}`;
    }

    let url = process.env.UWAVE_API_BASE_URL + endpoint;

    if (method === 'get' && data) {
      const querystring = querystringify(data);

      if (querystring) {
        url += `?${querystring}`;
      }
    } else if (data) {
      fetchOptions.headers['Content-Type'] = 'application/json';
      fetchOptions.body = JSON.stringify(data);
    }

    return fetch(url, fetchOptions).then((res) => res.json());
  }

  public get<I, R>(endpoint: string, query?: I) {
    return this.request<I, R>('get', endpoint, query);
  }

  public post<I, R>(endpoint: string, data?: I) {
    return this.request<I, R>('post', endpoint, data);
  }

  public put<I, R>(endpoint: string, data?: I) {
    return this.request<I, R>('put', endpoint, data);
  }

  public patch<I, R>(endpoint: string, data?: I) {
    return this.request<I, R>('patch', endpoint, data);
  }

  public delete<I extends {}, R>(endpoint: string, query?: I) {
    return this.request<I, R>('delete', endpoint, query);
  }
  // #endregion

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
    return this.connectSocket(this.options.wsConnectionString);
  }

  public disconnect() {
    if (this.socket) {
      this.socket.close();
    }
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

    if (!this.socketToken && this.jwt) {
      this.socketToken = await this.auth.getSocketToken();
    }

    if (this.socketToken) {
      this.socket.send(this.socketToken);

      // the token is expired after being validated
      delete this.socketToken;
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

  private emit<E extends Commands>(command: E, payload?: SocketPayloadsMap[E]) {
    return this.emitter.emit(command, payload);
  }

  private send<I>(message: I) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;

    return this.socket.send(JSON.stringify(message));
  }
  // #endregion
}

const querystringify = (obj: object = {}, keyPrefix?: string): string =>
  Object.entries(obj)
    .map(([key, value]) =>
      typeof value !== 'object'
        ? [keyPrefix ? `${keyPrefix}[${key}]` : key, value]
            .map(encodeURIComponent)
            .join('=')
        : querystringify(value, key)
    )
    .join('&');
