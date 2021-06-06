import { uWave } from '..';
import { uWaveAPI } from '../types';

type AuthCallback = (jwt: string, socketToken: string) => void;

export default class Auth {
  private uw: uWave;
  private onAuthenticated: AuthCallback;

  constructor(uw: uWave, onAuthenticated: AuthCallback) {
    this.uw = uw;

    this.onAuthenticated = onAuthenticated;
  }

  public getCurrentUser() {
    return this.uw
      .get<{}, uWaveAPI.CurrentUserResponse>('/auth')
      .then((res) => res.data);
  }

  public login(email: string, password: string) {
    return this.uw
      .post<uWaveAPI.LoginBody, uWaveAPI.LoginResponse>('/auth/login', {
        email,
        password,
      })
      .then((response) => {
        this.onAuthenticated(response.meta.jwt, response.meta.socketToken);

        return response.data;
      });
  }

  public logout() {
    return this.uw
      .delete<{}, uWaveAPI.LogoutResponse>('/auth')
      .then(() => null);
  }

  public getSocketToken() {
    return this.uw
      .get<{}, uWaveAPI.SocketTokenResponse>('/auth/socket')
      .then((res) => res.data.socketToken);
  }
}
