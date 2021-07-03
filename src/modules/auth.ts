import { uWave } from '..';
import { parseDates } from '../helpers';
import { uWaveAPI } from '../types';
import { User } from '../types/entities';

type AuthCallback = (jwt: string, socketToken: string) => void;

export default class Auth {
  private uw: uWave;
  private onAuthenticated: AuthCallback;

  static USER_DATE_FIELDS = ['lastSeenAt', 'createdAt', 'updatedAt'];

  constructor(uw: uWave, onAuthenticated: AuthCallback) {
    this.uw = uw;

    this.onAuthenticated = onAuthenticated;
  }

  public getCurrentUser(): Promise<User | null> {
    return this.uw.http
      .get<{}, uWaveAPI.CurrentUserResponse>('/auth')
      .then((response) => {
        if (!response.data) return null;

        return parseDates(response.data, Auth.USER_DATE_FIELDS);
      });
  }

  public getSocketToken(): Promise<string> {
    return this.uw.http
      .get<{}, uWaveAPI.SocketTokenResponse>('/auth/socket')
      .then((res) => res.data.socketToken);
  }

  public login(email: string, password: string): Promise<User> {
    return this.uw.http
      .post<uWaveAPI.LoginBody, uWaveAPI.LoginResponse>('/auth/login', {
        email,
        password,
      })
      .then((response) => {
        this.onAuthenticated(response.meta.jwt, response.meta.socketToken);

        return parseDates(response.data, Auth.USER_DATE_FIELDS);
      });
  }

  public logout(): Promise<null> {
    return this.uw.http
      .delete<{}, uWaveAPI.EmptyItemResponse>('/auth')
      .then(() => null);
  }
}
