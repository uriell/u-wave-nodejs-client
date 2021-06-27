import {
  HistoryEntry,
  Media,
  Playback,
  User,
  VoteDirections,
} from './entities';

type ItemResponse<Data = {}, Meta = {}> = {
  meta: Meta;
  links: { self?: string };
  data: Data;
};

type ListResponse<
  DataList = {}[],
  Included = {},
  IncludedExtractionResults = {},
  Meta = {}
> = ItemResponse<DataList[], Meta & { included: Included }> & {
  included: IncludedExtractionResults;
};

export type PaginatedMeta = {
  offset: number;
  pageSize: number;
  results: number;
  total: number;
};

type PaginatedResponse<
  Data = {},
  Included = {},
  IncludedExtractionResults = {}
> = ListResponse<Data, Included, IncludedExtractionResults, PaginatedMeta> & {
  links: { self: string; next: string; prev: string };
};

export declare namespace uWaveAPI {
  type LoginBody = { email: string; password: string };

  type LoginResponse = ItemResponse<
    User,
    {
      jwt: string;
      socketToken: string;
    }
  >;

  type EmptyItemResponse = ItemResponse;

  type SocketTokenResponse = ItemResponse<{ socketToken: string }>;

  type CurrentUserResponse = ItemResponse<User | null>;

  type BoothResponse = ItemResponse<HistoryEntry | null>;

  type HistoryQuery = { filter?: { media?: string } } & {
    page?: { offset?: number; limit?: number };
  };

  type HistoryListEntry = HistoryEntry & {
    media: Playback & { media: string };
    user: string;
  };

  type HistoryResponse = PaginatedResponse<
    HistoryListEntry,
    { media: ['media.media']; user: ['user'] },
    { media: Media[]; user: User[] }
  >;

  type CurrentVoteResponse = ItemResponse<VoteDirections>;

  type VoteBody = {
    direction: VoteDirections.UPVOTE | VoteDirections.DOWNVOTE;
  };

  type FavoriteBody = { playlistID: string; historyID: string };

  type FavoriteResponse = ListResponse<
    Playback & { media: string },
    { media: ['media'] },
    { media: Media[] },
    { playlistSize: number }
  >;

  type SkipBody =
    | { userID: string; reason: string; remove?: boolean }
    | { remove?: boolean };

  type ReplaceBoothBody = { userID: string };
}
