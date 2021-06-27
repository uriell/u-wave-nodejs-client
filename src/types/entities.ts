import type { SourceData } from './sources.js';

export type Media = {
  _id: string;
  duration: number;
  artist: string;
  title: string;
  thumbnail: string;
  sourceType: 'youtube' | 'soundcloud';
  sourceID: number | string;
  sourceData: SourceData;
  createdAt: Date;
  updatedAt: Date;
};

export type Playback = {
  start: number;
  end: number;
  title: string;
  artist: string;
  media: Media;
};

export type User = {
  _id: string;
  username: string;
  slug: string;
  avatar: string;
  roles: string[];
  role: number;
  level: number;
  language: string;
  exiled: boolean;
  activePlaylist?: string;
  lastSeenAt: Date;
  createdAt: Date;
  updatedAT: Date;
};

export type HistoryEntry = {
  historyID: string;
  playlistID: string;
  user: User;
  playedAt: Date;
  media: Playback;
  stats: {
    upvotes: number;
    downvotes: number;
    favorites: number;
  };
};

export enum VoteDirections {
  UPVOTE = 1,
  DIDNT_VOTE = 0,
  DOWNVOTE = -1,
}
