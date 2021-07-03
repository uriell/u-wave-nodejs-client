import fetch, { RequestInit } from 'node-fetch';

import { Auth, Booth, Http, Socket } from './modules';

export interface IUWaveOptions {
  apiBaseUrl: string;
  wsConnectionString: string;
  authImmediately?: boolean;
  credentials?: {
    email: string;
    password: string;
  };
}

export type PrivateTokenRef = { token?: string };
let privateSocketTokenRef: PrivateTokenRef = {};
const privateHttpTokenRef: PrivateTokenRef = {};

// eslint-disable-next-line @typescript-eslint/naming-convention
export class uWave {
  private jwt?: string;
  public options: IUWaveOptions;

  // #region modules
  private modules: {
    auth?: Auth;
    booth?: Booth;
    socket?: Socket;
    http?: Http;
  } = {};
  // #endregion

  constructor(options: IUWaveOptions) {
    this.options = options;

    if (!process.env.UWAVE_API_BASE_URL) {
      process.env.UWAVE_API_BASE_URL = options.apiBaseUrl;
    }

    const { credentials } = options;
    if (options.authImmediately && credentials) {
      delete this.options.credentials;

      this.auth
        .login(credentials.email, credentials.password)
        .then(() => this.socket.connect())
        .catch((err) => {
          throw err;
        });
    }
  }

  get auth(): Auth {
    if (!this.modules.auth) {
      this.modules.auth = new Auth(this, (jwt, socketToken) => {
        this.jwt = jwt;
        privateSocketTokenRef = { token: socketToken };
      });
    }

    return this.modules.auth;
  }

  get socket(): Socket {
    if (!this.modules.socket) {
      this.modules.socket = new Socket(this, privateSocketTokenRef);
    }

    return this.modules.socket;
  }

  get http(): Http {
    if (!this.modules.http) {
      this.modules.http = new Http(this, privateHttpTokenRef);
    }

    return this.modules.http;
  }

  get booth(): Booth {
    if (!this.modules.booth) {
      this.modules.booth = new Booth(this);
    }

    return this.modules.booth;
  }

  get isAuthenticated(): boolean {
    return !!this.jwt;
  }

  public sendChat(message: string): void {
    return this.socket.send({ command: 'sendChat', data: message });
  }

  public vote(direction: 1 | -1): void {
    return this.socket.send({ command: 'vote', data: direction });
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

    if (!process.env.UWAVE_API_BASE_URL) {
      throw new Error('Env "UWAVE_API_BASE_URL" is not set.');
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

    return fetch(url, fetchOptions).then((res) => res.json() as Promise<R>);
  }

  public get<I, R>(endpoint: string, query?: I): Promise<R> {
    return this.request<I, R>('get', endpoint, query);
  }

  public post<I, R>(endpoint: string, data?: I): Promise<R> {
    return this.request<I, R>('post', endpoint, data);
  }

  public put<I, R>(endpoint: string, data?: I): Promise<R> {
    return this.request<I, R>('put', endpoint, data);
  }

  public patch<I, R>(endpoint: string, data?: I): Promise<R> {
    return this.request<I, R>('patch', endpoint, data);
  }

  public delete<I, R>(endpoint: string, query?: I): Promise<R> {
    return this.request<I, R>('delete', endpoint, query);
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
