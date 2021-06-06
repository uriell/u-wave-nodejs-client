import { User } from './entities';

export declare namespace uWaveAPI {
  type LoginBody = {
    email: string;
    password: string;
  };

  type LoginResponse = {
    meta: {
      jwt: string;
      socketToken: string;
    };
    links: {};
    data: User;
  };

  type SocketTokenResponse = {
    meta: { url: string };
    links: { self: string };
    data: { socketToken: string };
  };
}
