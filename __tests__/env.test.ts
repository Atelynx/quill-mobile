import { getDataMode } from '../src/config/env';

describe('env config', () => {
  it('usa mocks por defecto', () => {
    delete process.env.EXPO_PUBLIC_USE_MOCKS;
    expect(getDataMode()).toBe('mock');
  });

  it('usa backend cuando la variable lo solicita', () => {
    process.env.EXPO_PUBLIC_USE_MOCKS = 'false';
    expect(getDataMode()).toBe('backend');
  });
});
