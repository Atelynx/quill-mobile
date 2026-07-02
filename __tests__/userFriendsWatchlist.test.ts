import { ApiError } from '../src/api/httpClient';
import { BackendRepository } from '../src/services/backendRepository';
import { MockRepository } from '../src/services/mockRepository';
import { resetMockState } from '../src/services/mockState';

describe('user profile, friends and watchlist repository', () => {
  beforeEach(() => {
    resetMockState();
  });

  it('carga y edita perfil con endpoints reales', async () => {
    const client = { request: jest.fn().mockResolvedValue({ fullName: 'Ana', watchlist: [] }) };
    const repository = new BackendRepository(client as never);

    await repository.getProfile();
    await repository.updateProfile({ fullName: 'Ana Nueva', username: 'ana' });

    expect(client.request).toHaveBeenNthCalledWith(1, '/users/me');
    expect(client.request).toHaveBeenNthCalledWith(2, '/users/me', {
      method: 'PATCH',
      body: JSON.stringify({ fullName: 'Ana Nueva', username: 'ana' }),
    });
  });

  it('cambia email y contraseña con endpoints reales', async () => {
    const client = { request: jest.fn().mockResolvedValue({ message: 'ok' }) };
    const repository = new BackendRepository(client as never);

    await repository.changeEmail({ currentPassword: 'Actual123!', newEmail: 'nuevo@quill.local' });
    await repository.changePassword({ currentPassword: 'Actual123!', newPassword: 'Nueva123!' });

    expect(client.request).toHaveBeenCalledWith('/users/me/email', expect.objectContaining({ method: 'PATCH' }));
    expect(client.request).toHaveBeenCalledWith('/users/me/password', expect.objectContaining({ method: 'PATCH' }));
  });

  it('agrega y quita watchlist con endpoints reales', async () => {
    const client = { request: jest.fn().mockResolvedValue({ watchlist: ['AAPL.US'] }) };
    const repository = new BackendRepository(client as never);

    await repository.addToWatchlist(['AAPL.US']);
    await repository.removeFromWatchlist('AAPL.US');

    expect(client.request).toHaveBeenNthCalledWith(1, '/users/me/watchlist', {
      method: 'POST',
      body: JSON.stringify({ symbols: ['AAPL.US'] }),
    });
    expect(client.request).toHaveBeenNthCalledWith(2, '/users/me/watchlist/AAPL.US', { method: 'DELETE' });
  });

  it('lista amigos y solicitudes con endpoints reales', async () => {
    const client = { request: jest.fn().mockResolvedValue([]) };
    const repository = new BackendRepository(client as never);

    await repository.getFriends();
    await repository.getFriendRequests();

    expect(client.request).toHaveBeenNthCalledWith(1, '/users/me/friends');
    expect(client.request).toHaveBeenNthCalledWith(2, '/users/me/friends/requests');
  });

  it.each([401, 404, 500])('propaga errores HTTP %s sin simular datos', async (status) => {
    const client = { request: jest.fn().mockRejectedValue(new ApiError('Solicitud rechazada', status)) };
    const repository = new BackendRepository(client as never);

    await expect(repository.getProfile()).rejects.toMatchObject({ status });
    await expect(repository.getFriends()).rejects.toMatchObject({ status });
  });

  it('mock permite editar perfil, cambiar credenciales y listar social', async () => {
    const repository = new MockRepository();

    await expect(repository.updateProfile({ fullName: 'Nombre Demo', username: 'demo_new' }))
      .resolves.toMatchObject({ fullName: 'Nombre Demo', username: 'demo_new' });
    await expect(repository.changeEmail({ currentPassword: 'x', newEmail: 'nuevo@quill.local' }))
      .resolves.toMatchObject({ message: 'Correo demo actualizado.' });
    await expect(repository.changePassword({ currentPassword: 'x', newPassword: 'y' }))
      .resolves.toMatchObject({ message: 'Contraseña demo actualizada.' });
    await expect(repository.getFriends()).resolves.toEqual(
      expect.arrayContaining([expect.objectContaining({ _id: 'friend-1' })]),
    );
    await expect(repository.getFriendRequests()).resolves.toHaveLength(1);
  });
});
