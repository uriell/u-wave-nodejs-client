import fetch, { RequestInit } from 'node-fetch';

import { PrivateTokenRef, uWave } from '..';

let privateHttpTokenRef: PrivateTokenRef = {};

export default class HttpModule {
  private uw: uWave;

  constructor(uw: uWave, tokenRef: PrivateTokenRef) {
    this.uw = uw;

    privateHttpTokenRef = tokenRef;
  }

  static get isAuthenticated(): boolean {
    return !!this.jwt;
  }

  static get jwt(): string | undefined {
    return privateHttpTokenRef.token;
  }

  public request<I extends {}, R extends {}>(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    endpoint: string,
    data?: I
  ): Promise<R> {
    const fetchOptions: RequestInit = { method };
    fetchOptions.headers = {};

    if (privateHttpTokenRef.token) {
      fetchOptions.headers.Authorization = `JWT ${privateHttpTokenRef.token}`;
    }

    let url = this.uw.options.apiBaseUrl + endpoint;

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
