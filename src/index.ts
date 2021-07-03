import { Auth, Booth, Http, Socket } from './modules';

export interface IUWaveOptions {
  apiBaseUrl: string;
  wsConnectionString: string;
}

export type PrivateTokenRef = { token?: string };
let privateSocketTokenRef: PrivateTokenRef = {};
let privateHttpTokenRef: PrivateTokenRef = {};

// eslint-disable-next-line @typescript-eslint/naming-convention
export class uWave {
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
  }

  get auth(): Auth {
    if (!this.modules.auth) {
      this.modules.auth = new Auth(this, (jwt, socketToken) => {
        privateHttpTokenRef = { token: jwt };
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

  public sendChat(message: string): void {
    return this.socket.send({ command: 'sendChat', data: message });
  }

  public vote(direction: 1 | -1): void {
    return this.socket.send({ command: 'vote', data: direction });
  }
}
