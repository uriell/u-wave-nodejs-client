import { uWave } from '..';
import { uWaveAPI } from '../types';

export default class Auth {
  private uw: uWave;

  constructor(uw: uWave) {
    this.uw = uw;
  }

  public login(email: string, password: string) {
    return this.uw.post<uWaveAPI.LoginBody, uWaveAPI.LoginResponse>(
      '/auth/login',
      {
        email,
        password,
      }
    );
  }

  public getSocketToken() {
    return this.uw.get<{}, uWaveAPI.SocketTokenResponse>('/auth/socket');
  }
}
