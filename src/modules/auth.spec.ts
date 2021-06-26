import { uWave } from '..';
import AuthModule from './auth';

test('should create an auth module instance', () => {
  const uw = {} as uWave;
  const onAuthenticated = jest.fn();
  const auth = new AuthModule(uw, onAuthenticated);

  expect(auth).toBeInstanceOf(AuthModule);
  expect(auth['uw']).toEqual(uw);
  expect(auth['onAuthenticated']).toEqual(onAuthenticated);
  expect(auth).toMatchInlineSnapshot(`
Auth {
  "onAuthenticated": [MockFunction],
  "uw": Object {},
}
`);
});
