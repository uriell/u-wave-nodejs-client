import EventEmitter = require('events');
import { PrivateSocketTokenRef, uWave } from '..';
import SocketModule from './socket';

test('should create an socket module instance', () => {
  const uw = new (class Test {})() as uWave;
  const privateSocketTokenRef: PrivateSocketTokenRef = {};
  const socket = new SocketModule(uw, privateSocketTokenRef);

  expect(socket).toBeInstanceOf(SocketModule);
  expect(socket['emitter']).toBeInstanceOf(EventEmitter);
  expect(socket['uw']).toEqual(uw);
  expect(socket).toMatchInlineSnapshot(`
Socket {
  "emitter": EventEmitter {
    "_events": Object {},
    "_eventsCount": 0,
    "_maxListeners": undefined,
    Symbol(kCapture): false,
  },
  "uw": Test {},
}
`);
});
