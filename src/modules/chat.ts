import { uWave } from '..';

export default class Chat {
  private uw: uWave;

  constructor(uw: uWave) {
    this.uw = uw;
  }

  public sendChat(message: string): void {
    return this.uw.socket.send({ command: 'sendChat', data: message });
  }
}
