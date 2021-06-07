import { uWave } from '..';
import { parseDates } from '../helpers';
import { uWaveAPI } from '../types';

type AuthCallback = (jwt: string, socketToken: string) => void;

export default class Auth {
  private uw: uWave;
  private onAuthenticated: AuthCallback;

  static USER_DATE_FIELDS = ['lastSeenAt', 'createdAt', 'updatedAt'];

  constructor(uw: uWave, onAuthenticated: AuthCallback) {
    this.uw = uw;

    this.onAuthenticated = onAuthenticated;
  }

  public getCurrentUser() {
    return this.uw
      .get<{}, uWaveAPI.CurrentUserResponse>('/auth')
      .then((response) => {
        if (!response.data) return null;

        return parseDates(response.data, Auth.USER_DATE_FIELDS);
      });
  }

  public getSocketToken() {
    return this.uw
      .get<{}, uWaveAPI.SocketTokenResponse>('/auth/socket')
      .then((res) => res.data.socketToken);
  }

  public login(email: string, password: string) {
    return this.uw
      .post<uWaveAPI.LoginBody, uWaveAPI.LoginResponse>('/auth/login', {
        email,
        password,
      })
      .then((response) => {
        this.onAuthenticated(response.meta.jwt, response.meta.socketToken);

        return parseDates(response.data, Auth.USER_DATE_FIELDS);
      });
  }

  public logout() {
    return this.uw
      .delete<{}, uWaveAPI.LogoutResponse>('/auth')
      .then(() => null);
  }
}
