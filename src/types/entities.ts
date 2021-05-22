import { SourceData } from './sources';

export type Media = {
  _id: string;
  duration: number;
  artist: string;
  title: string;
  thumbnail: string;
  sourceType: 'youtube' | 'soundcloud';
  sourceID: number | string;
  sourceData: SourceData;
  createdAt: string;
  updatedAt: string;
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
  lastSeenAt: string;
  createdAt: string;
  updatedAT: string;
};
