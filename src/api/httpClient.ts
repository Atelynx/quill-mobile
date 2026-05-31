import { appConfig } from '../config/env';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
  }
}

export class HttpClient {
  constructor(
    private readonly getToken: () => string | undefined,
    private readonly onUnauthorized?: () => void,
  ) {}

  async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const headers = new Headers(init.headers);
    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');
    const token = this.getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`${appConfig.apiBaseUrl}${path}`, { ...init, headers });
    if (!response.ok) {
      if (response.status === 401) {
        this.onUnauthorized?.();
      }
      throw new ApiError(await this.safeMessage(response), response.status);
    }
    return response.json() as Promise<T>;
  }

  private async safeMessage(response: Response) {
    try {
      const body = (await response.json()) as { message?: unknown };
      return typeof body.message === 'string' ? body.message : 'Solicitud rechazada.';
    } catch {
      return 'No fue posible procesar la respuesta del servidor.';
    }
  }
}
