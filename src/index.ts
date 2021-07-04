import { Auth, Booth, Chat, Http, Socket } from './modules';

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

  constructor(options: IUWaveOptions) {
    this.options = options;
  }

  // #region modules
  private modules: {
    auth?: Auth;
    booth?: Booth;
    chat?: Chat;
    socket?: Socket;
    http?: Http;
  } = {};

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

  get chat(): Chat {
    if (!this.modules.chat) {
      this.modules.chat = new Chat(this);
    }

    return this.modules.chat;
  }
  // #endregion
}
