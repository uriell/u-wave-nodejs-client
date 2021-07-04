import { uWave } from '..';
import { uWaveAPI } from '../types';

export default class Chat {
  private uw: uWave;

  constructor(uw: uWave) {
    this.uw = uw;
  }

  public sendChat(message: string): void {
    return this.uw.socket.send({ command: 'sendChat', data: message });
  }

  public deleteAll(): Promise<null> {
    return this.uw
      .delete<{}, uWaveAPI.EmptyItemResponse>('/chat')
      .then(() => null);
  }

  public deleteAllByUser(userId: string): Promise<null> {
    return this.uw
      .delete<{}, uWaveAPI.EmptyItemResponse>(`/chat/${userId}`)
      .then(() => null);
  }

  public deleteMessage(messageId: string): Promise<null> {
    return this.uw
      .delete<{}, uWaveAPI.EmptyItemResponse>(`/chat/${messageId}`)
      .then(() => null);
  }

  public muteUser(userId: string, duration: number): Promise<null> {
    return this.uw
      .post<uWaveAPI.MuteUserBody, uWaveAPI.EmptyItemResponse>(
        `/users/${userId}/mute`,
        { time: duration }
      )
      .then(() => null);
  }

  public unmuteUser(userId: string): Promise<null> {
    return this.uw
      .delete<{}, uWaveAPI.EmptyItemResponse>(`/users/${userId}/mute`)
      .then(() => null);
  }
}
