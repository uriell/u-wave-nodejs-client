import { PrivateTokenRef, uWave } from '..';
import HttpModule from './http';

test('should create an socket module instance', () => {
  const uw = new (class Test {})() as uWave;
  const privateHttpTokenRef: PrivateTokenRef = {};
  const http = new HttpModule(uw, privateHttpTokenRef);

  expect(http).toBeInstanceOf(HttpModule);
  expect(http['uw']).toEqual(uw);
  expect(http).toMatchInlineSnapshot(`
HttpModule {
  "uw": Test {},
}
`);
});
