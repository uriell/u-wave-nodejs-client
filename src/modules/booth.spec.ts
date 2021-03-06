import { uWave } from '..';
import BoothModule from './booth';

test('should create an booth module instance', () => {
  const uw = new (class Test {})() as uWave;
  const booth = new BoothModule(uw);

  expect(booth).toBeInstanceOf(BoothModule);
  expect(booth['uw']).toEqual(uw);
  expect(booth).toMatchInlineSnapshot(`
Booth {
  "uw": Test {},
}
`);
});
