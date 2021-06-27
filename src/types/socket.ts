import { Playback, User } from './entities';

declare namespace uWaveSocket {
  type Authenticated = {
    command: 'authenticated';
    data: undefined;
  };

  type Join = {
    command: 'join';
    data: User;
  };

  type Leave = {
    command: 'leave';
    data: string;
  };

  type NameChange = {
    command: 'nameChange';
    data: { moderatorID: string; userID: string; username: string };
  };

  type Advance = {
    command: 'advance';
    data: {
      historyID: string;
      userID: string;
      item: string;
      playedAt: number;
      media: Playback;
    };
  };

  type Favorite = {
    command: 'favorite';
    data: { userID: string };
  };

  type Vote = {
    command: 'vote';
    data: { _id: string; value: number };
  };

  type PlaylistCycle = {
    command: 'playlistCycle';
    data: { playlistID: string };
  };

  type WaitlistJoin = {
    command: 'waitlistJoin';
    data: { userID: string; waitlist: string[] };
  };

  type WaitlistLeave = {
    command: 'waitlistLeave';
    data: { userID: string; waitlist: string[] };
  };

  type WaitlistUpdate = {
    command: 'waitlistUpdate';
    data: string[];
  };

  type WaitlistLock = {
    command: 'waitlistLock';
    data: { moderatorID: string; locked: boolean };
  };

  type WaitlistClear = {
    command: 'waitlistClear';
    data: { moderatorID: string };
  };

  type WaitlistAdd = {
    command: 'waitlistAdd';
    data: {
      moderatorID: string;
      userID: string;
      position: number;
      waitlist: string[];
    };
  };

  type WaitlistMove = {
    command: 'waitlistMove';
    data: {
      moderatorID: string;
      userID: string;
      position: number;
      waitlist: string[];
    };
  };

  type WaitlistRemove = {
    command: 'waitlistRemove';
    data: {
      moderatorID: string;
      userID: string;
      waitlist: string[];
    };
  };

  type Skip = {
    command: 'skip';
    data: {
      moderatorID: string;
      userID: string;
      reason: string;
    };
  };

  type ChatMessage = {
    command: 'chatMessage';
    data: {
      id: string;
      userID: string;
      message: string;
      timestamp: number;
    };
  };

  type ChatDelete = {
    command: 'chatDelete';
    data: { moderatorID: string };
  };

  type ChatDeleteID = {
    command: 'chatDeleteByID';
    data: { _id: string; moderatorID: string };
  };

  type ChatDeleteUser = {
    command: 'chatDeleteByUser';
    data: { moderatorID: string; userID: string };
  };

  type ChatMute = {
    command: 'chatMute';
    data: { moderatorID: string; userID: string; expiresAt: number };
  };

  type ChatUnmute = {
    command: 'chatUnmute';
    data: { moderatorID: string; userID: string };
  };

  type Ban = {
    command: 'ban';
    data: {
      moderatorID: string;
      userID: string;
      permanent: boolean;
      duration: number;
      expiresAt: number;
    };
  };

  type Unban = {
    command: 'unban';
    data: { moderatorID: string; userID: string };
  };

  type RoleChange = {
    command: 'roleChange';
    data: { moderatorID: string; userID: string; role: number };
  };

  type AclAllow = {
    command: 'acl:allow';
    data: { userID: string; roles: string[] };
  };

  type AclDisallow = {
    command: 'acl:disallow';
    data: { userID: string; roles: string[] };
  };
}

export type SocketEvents =
  | uWaveSocket.AclAllow
  | uWaveSocket.AclDisallow
  | uWaveSocket.Advance
  | uWaveSocket.Authenticated
  | uWaveSocket.Ban
  | uWaveSocket.ChatDelete
  | uWaveSocket.ChatDeleteID
  | uWaveSocket.ChatDeleteUser
  | uWaveSocket.ChatMessage
  | uWaveSocket.ChatMute
  | uWaveSocket.ChatUnmute
  | uWaveSocket.Favorite
  | uWaveSocket.Join
  | uWaveSocket.Leave
  | uWaveSocket.NameChange
  | uWaveSocket.PlaylistCycle
  | uWaveSocket.RoleChange
  | uWaveSocket.Skip
  | uWaveSocket.Unban
  | uWaveSocket.Vote
  | uWaveSocket.WaitlistAdd
  | uWaveSocket.WaitlistClear
  | uWaveSocket.WaitlistJoin
  | uWaveSocket.WaitlistLeave
  | uWaveSocket.WaitlistLock
  | uWaveSocket.WaitlistMove
  | uWaveSocket.WaitlistRemove
  | uWaveSocket.WaitlistUpdate;

type SocketCommands = SocketEvents['command'];
type LibCommands = 'login' | 'connected' | 'disconnected' | 'error';

export type Commands = SocketCommands | LibCommands;

export interface SocketPayloadsMap
  extends Record<Commands, SocketEvents['data']> {
  'acl:allow': uWaveSocket.AclAllow['data'];
  'acl:disallow': uWaveSocket.AclDisallow['data'];
  advance: uWaveSocket.Advance['data'];
  authenticated: uWaveSocket.Authenticated['data'];
  ban: uWaveSocket.Ban['data'];
  chatDelete: uWaveSocket.ChatDelete['data'];
  chatDeleteID: uWaveSocket.ChatDeleteID['data'];
  chatDeleteUser: uWaveSocket.ChatDeleteUser['data'];
  chatMessage: uWaveSocket.ChatMessage['data'];
  chatMute: uWaveSocket.ChatMute['data'];
  chatUnmute: uWaveSocket.ChatUnmute['data'];
  favorite: uWaveSocket.Favorite['data'];
  join: uWaveSocket.Join['data'];
  leave: uWaveSocket.Leave['data'];
  nameChange: uWaveSocket.NameChange['data'];
  playlistCycle: uWaveSocket.PlaylistCycle['data'];
  roleChange: uWaveSocket.RoleChange['data'];
  skip: uWaveSocket.Skip['data'];
  unban: uWaveSocket.Unban['data'];
  vote: uWaveSocket.Vote['data'];
  waitlistAdd: uWaveSocket.WaitlistAdd['data'];
  waitlistClear: uWaveSocket.WaitlistClear['data'];
  waitlistJoin: uWaveSocket.WaitlistJoin['data'];
  waitlistLeave: uWaveSocket.WaitlistLeave['data'];
  waitlistLock: uWaveSocket.WaitlistLock['data'];
  waitlistMove: uWaveSocket.WaitlistMove['data'];
  waitlistRemove: uWaveSocket.WaitlistRemove['data'];
  waitlistUpdate: uWaveSocket.WaitlistUpdate['data'];
}
