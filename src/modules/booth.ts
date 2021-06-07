import { uWave } from '..';

import { parseDates } from '../helpers';
import { uWaveAPI } from '../types';
import Auth from './auth';
import { HistoryEntry, Media, User, VOTE_DIRECTIONS } from '../types/entities';

export default class Booth {
  private uw: uWave;

  static VOTE_DIRECTIONS = VOTE_DIRECTIONS;

  constructor(uw: uWave) {
    this.uw = uw;
  }

  public getBooth() {
    return this.uw
      .get<{}, uWaveAPI.BoothResponse>('/booth')
      .then((response) => {
        if (!response.data) return null;

        return parseDates<HistoryEntry>(response.data, [
          'playedAt',
          'media.media.createdAt',
          'media.media.updatedAt',
        ]);
      });
  }

  public getHistory(media?: string, offset?: number, limit?: number) {
    return this.uw
      .get<uWaveAPI.HistoryQuery, uWaveAPI.HistoryResponse>('/booth/history', {
        filter: { media },
        page: { offset, limit },
      })
      .then((response) => {
        response.data = response.data.map((historyEntry) =>
          parseDates<uWaveAPI.HistoryListEntry>(historyEntry, ['playedAt'])
        );

        response.included.media = response.included.media.map((media) =>
          parseDates<Media>(media, ['createdAt', 'updatedAt'])
        );

        response.included.user = response.included.user.map((user) =>
          parseDates<User>(user, Auth.USER_DATE_FIELDS)
        );

        return response;
      });
  }

  public getVote(historyId: string) {
    return this.uw
      .get<{}, uWaveAPI.CurrentVoteResponse>(`/booth/${historyId}/vote`)
      .then((res) => res.data);
  }

  public vote(
    historyId: string,
    direction: VOTE_DIRECTIONS.UPVOTE | VOTE_DIRECTIONS.DOWNVOTE
  ) {
    return this.uw
      .put<uWaveAPI.VoteBody, uWaveAPI.EmptyItemResponse>(
        `/booth/${historyId}/vote`,
        { direction }
      )
      .then(() => null);
  }

  public favorite(playlistID: string, historyID: string) {
    return this.uw.post<uWaveAPI.FavoriteBody, uWaveAPI.FavoriteResponse>(
      '/booth/favorite',
      { playlistID, historyID }
    );
  }

  public skip(remove?: boolean): Promise<null>;
  public skip(remove: boolean, userID: string, reason: string): Promise<null>;
  public skip(remove?: boolean, userID?: string, reason?: string) {
    return this.uw
      .post<uWaveAPI.SkipBody, uWaveAPI.EmptyItemResponse>('/booth/skip', {
        userID,
        reason,
        remove,
      })
      .then(() => null);
  }

  public replaceBooth(userID: string) {
    return this.uw
      .post<uWaveAPI.ReplaceBoothBody, uWaveAPI.EmptyItemResponse>(
        '/booth/skip',
        {
          userID,
        }
      )
      .then(() => null);
  }
}
