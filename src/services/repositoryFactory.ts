import { HttpClient } from '../api/httpClient';
import { appConfig, getDataMode, type DataMode } from '../config/env';
import { BackendRepository } from './backendRepository';
import type { DataRepository } from './contracts';
import { FallbackRepository } from './fallbackRepository';
import { MockRepository } from './mockRepository';

export interface RepositoryBundle {
  mode: DataMode;
  repository: DataRepository;
}

export const createRepositoryBundle = (
  getToken: () => string | undefined,
  onUnauthorized?: () => void,
): RepositoryBundle => {
  const mode = getDataMode();
  if (mode === 'mock') {
    return { mode, repository: new MockRepository() };
  }
  const backend = new BackendRepository(new HttpClient(getToken, onUnauthorized));
  const repository = appConfig.fallbackToMocks
    ? new FallbackRepository(backend, new MockRepository())
    : backend;
  return { mode, repository };
};
