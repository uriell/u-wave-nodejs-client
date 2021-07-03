import { uWave } from '..';

import { groupById, parseDates, setPathValue } from '../helpers';
import { uWaveAPI } from '../types';
import Auth from './auth';
import { HistoryEntry, Playback, VoteDirections } from '../types/entities';
import { PaginatedHistoryEntries } from '../types/domain';

export default class Booth {
  private uw: uWave;

  static VoteDirections = VoteDirections;
  static HISTORY_ENTRY_DATE_FIELDS = [
    'playedAt',
    'media.media.createdAt',
    'media.media.updatedAt',
  ];

  constructor(uw: uWave) {
    this.uw = uw;
  }

  public getBooth(): Promise<HistoryEntry | null> {
    return this.uw.http
      .get<{}, uWaveAPI.BoothResponse>('/booth')
      .then((response) => {
        if (!response.data) return null;

        return parseDates<HistoryEntry>(
          response.data,
          Booth.HISTORY_ENTRY_DATE_FIELDS
        );
      });
  }

  public getHistory(
    media?: string,
    offset?: number,
    limit?: number
  ): Promise<PaginatedHistoryEntries> {
    const queryOptions: uWaveAPI.HistoryQuery = {};

    if (media) queryOptions.filter = { media };
    if (offset || limit) queryOptions.page = { offset, limit };

    return this.uw.http
      .get<uWaveAPI.HistoryQuery, uWaveAPI.HistoryResponse>(
        '/booth/history',
        queryOptions
      )
      .then((response) => {
        const includedMedia = groupById(response.included.media);
        const includedUsers = groupById(response.included.user);

        const historyEntries = response.data.map((historyEntry) => {
          const newHistoryEntry = { ...historyEntry };

          (newHistoryEntry as HistoryEntry).user =
            includedUsers[newHistoryEntry.user];
          (newHistoryEntry as HistoryEntry).media.media =
            includedMedia[newHistoryEntry.media.media];

          return parseDates<uWaveAPI.HistoryListEntry>(newHistoryEntry, [
            ...Booth.HISTORY_ENTRY_DATE_FIELDS,
            ...Auth.USER_DATE_FIELDS.map((field) => `user.${field}`),
          ]);
        });

        const prevQueryOptions: uWaveAPI.HistoryQuery = parseQs(
          response.links.prev.split('?')[1]
        );
        const nextQueryOptions: uWaveAPI.HistoryQuery = parseQs(
          response.links.next.split('?')[1]
        );

        const pagination = {
          ...response.meta,
          included: undefined,

          getPrevPage: () =>
            this.getHistory(
              media,
              prevQueryOptions.page?.offset,
              prevQueryOptions.page?.limit
            ),
          getCurrentPage: () => this.getHistory(media, offset, limit),
          getNextPage: () =>
            this.getHistory(
              media,
              nextQueryOptions.page?.offset,
              nextQueryOptions.page?.offset
            ),
        };

        delete pagination.included;

        return { historyEntries, pagination };
      });
  }

  public getVote(historyId: string): Promise<VoteDirections> {
    return this.uw.http
      .get<{}, uWaveAPI.CurrentVoteResponse>(`/booth/${historyId}/vote`)
      .then((res) => res.data);
  }

  public vote(
    historyId: string,
    direction: VoteDirections.UPVOTE | VoteDirections.DOWNVOTE
  ): Promise<null> {
    return this.uw.http
      .put<uWaveAPI.VoteBody, uWaveAPI.EmptyItemResponse>(
        `/booth/${historyId}/vote`,
        { direction }
      )
      .then(() => null);
  }

  public favorite(
    playlistID: string,
    historyID: string
  ): Promise<{ item: Playback; playlistSize: number }> {
    return this.uw.http
      .post<uWaveAPI.FavoriteBody, uWaveAPI.FavoriteResponse>(
        '/booth/favorite',
        { playlistID, historyID }
      )
      .then((response) => {
        const playlistItem: Playback = {
          ...response.data[0],
          media: response.included.media[0],
        };

        return { item: playlistItem, playlistSize: response.meta.playlistSize };
      });
  }

  public skip(remove?: boolean): Promise<null>;
  public skip(remove: boolean, userID: string, reason: string): Promise<null>;
  public skip(
    remove?: boolean,
    userID?: string,
    reason?: string
  ): Promise<null> {
    return this.uw.http
      .post<uWaveAPI.SkipBody, uWaveAPI.EmptyItemResponse>('/booth/skip', {
        userID,
        reason,
        remove,
      })
      .then(() => null);
  }

  public replaceBooth(userID: string): Promise<null> {
    return this.uw.http
      .post<uWaveAPI.ReplaceBoothBody, uWaveAPI.EmptyItemResponse>(
        '/booth/skip',
        {
          userID,
        }
      )
      .then(() => null);
  }
}

const parseQs = (querystring: string) => {
  const chunks = decodeURIComponent(querystring).split('&');
  const queryOptions = {};

  chunks.forEach((chunk) => {
    const [key, value] = chunk.split('=');
    const keyPath = key.split(/\[|\]/g).filter(Boolean);

    setPathValue(queryOptions, keyPath, value);
  });

  return queryOptions;
};
