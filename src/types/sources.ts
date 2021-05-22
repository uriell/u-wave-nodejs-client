declare namespace SourceDatas {
  type YouTube = {
    embedWidth: string | number | null;
    embedHeight: string | number | null;
    blockedIn: string[];
    chapters: Array<{
      start: number;
      end: number;
      title: string;
    }>;
  };

  type SoundCloud = {
    fullTitle: string;
    permalinkUrl: string;
    streamUrl: string;
    artistUrl: string;
    username: string;
  };
}

export type SourceData = SourceDatas.YouTube | SourceDatas.SoundCloud;
