import { HttpClient } from '../api/httpClient';
import { getDataMode, type DataMode } from '../config/env';
import { BackendRepository } from './backendRepository';
import type { DataRepository } from './contracts';
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
  return { mode, repository: new BackendRepository(new HttpClient(getToken, onUnauthorized)) };
};
