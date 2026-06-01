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
    if (response.status >= 500) {
      return 'El servidor no pudo completar la solicitud. Intenta nuevamente.';
    }
    try {
      const body = (await response.json()) as { message?: unknown };
      if (typeof body.message === 'string') {
        return body.message;
      }
      if (Array.isArray(body.message)) {
        return body.message.filter((item) => typeof item === 'string').join(' ');
      }
      if (response.status === 409) {
        return 'Ya existe una cuenta con ese correo.';
      }
      if (response.status === 400) {
        return 'Revisa los datos ingresados.';
      }
      return 'Solicitud rechazada.';
    } catch {
      return 'No fue posible procesar la respuesta del servidor.';
    }
  }
}
