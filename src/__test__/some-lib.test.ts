import { doSomething } from '../lib/some-lib';

describe('doSomething', () => {
  it('returns 50', async () => {
    expect(await doSomething()).toBe(50);
  });
});
