import { HttpClient } from '../src/api/httpClient';

describe('HttpClient', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('adjunta token Bearer a solicitudes backend', async () => {
    const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    } as Response);
    const client = new HttpClient(() => 'abc');

    await client.request('/users/me');

    const headers = fetchMock.mock.calls[0][1]?.headers as Headers;
    expect(headers.get('Authorization')).toBe('Bearer abc');
  });

  it('notifica sesión inválida en respuestas 401', async () => {
    const onUnauthorized = jest.fn();
    jest.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ message: 'No autorizado.' }),
    } as Response);
    const client = new HttpClient(() => 'abc', onUnauthorized);

    await expect(client.request('/users/me')).rejects.toThrow('No autorizado.');
    expect(onUnauthorized).toHaveBeenCalledTimes(1);
  });
});
