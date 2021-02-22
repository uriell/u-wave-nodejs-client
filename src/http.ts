import fetch, { RequestInit } from 'node-fetch';

type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';
interface IRequestOptions {
  token?: string;
}

const request = <I extends {}, R extends {}>(
  method: Method,
  endpoint: string,
  data: I,
  options: IRequestOptions = {}
): Promise<R> => {
  const fetchOptions: RequestInit = { method };
  fetchOptions.headers = {};

  if (options.token) {
    fetchOptions.headers.Authorization = `JWT ${options.token}`;
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
};

const querystringify = (obj: object = {}) =>
  Object.entries(obj)
    .map((pair) => pair.map(encodeURIComponent).join('='))
    .join('&');

type PartialArgs<I> = [string, I, IRequestOptions?];

export const get = <I, R>(...args: PartialArgs<I>) =>
  request<I, R>('get', ...args);
export const post = <I, R>(...args: PartialArgs<I>) =>
  request<I, R>('post', ...args);
export const put = <I, R>(...args: PartialArgs<I>) =>
  request<I, R>('put', ...args);
export const patch = <I, R>(...args: PartialArgs<I>) =>
  request<I, R>('patch', ...args);
export const del = <I, R>(...args: PartialArgs<I>) =>
  request<I, R>('delete', ...args);
