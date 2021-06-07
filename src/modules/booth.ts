import { uWave } from '..';

import { parseDates } from '../helpers';
import { uWaveAPI } from '../types';
import type { Booth as BoothEntity } from '../types/entities';

export default class Booth {
  private uw: uWave;

  constructor(uw: uWave) {
    this.uw = uw;
  }

  public getBooth() {
    return this.uw
      .get<{}, uWaveAPI.BoothResponse>('/booth')
      .then((response) => {
        if (!response.data) return null;

        return parseDates<BoothEntity>(response.data, [
          'playedAt',
          'media.media.createdAt',
          'media.media.updatedAt',
        ]);
      });
  }
}
