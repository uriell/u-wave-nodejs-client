import { uWave } from '..';
import ChatModule from './chat';

test('should create an chat module instance', () => {
  const uw = new (class Test {})() as uWave;
  const chat = new ChatModule(uw);

  expect(chat).toBeInstanceOf(ChatModule);
  expect(chat['uw']).toEqual(uw);
  expect(chat).toMatchInlineSnapshot(`
Chat {
  "uw": Test {},
}
`);
});
