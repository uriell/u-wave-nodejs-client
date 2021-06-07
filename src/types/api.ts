import { Booth, User } from './entities';

type ItemResponse<D = {}, M = {}> = {
  meta: M;
  links: { self?: string };
  data: D;
};

export declare namespace uWaveAPI {
  type LoginBody = {
    email: string;
    password: string;
  };

  type LoginResponse = ItemResponse<
    User,
    {
      jwt: string;
      socketToken: string;
    }
  >;

  type LogoutResponse = ItemResponse;

  type SocketTokenResponse = ItemResponse<{ socketToken: string }>;

  type CurrentUserResponse = ItemResponse<User | null>;

  type BoothResponse = ItemResponse<Booth | null>;
}
