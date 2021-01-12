import { Credentials } from './user.model';

export class MockCredentialsService {
  credentials: Credentials | null = {
    name: 'test',
    token: '123',
  };

  isAuthenticated(): boolean {
    return !!this.credentials;
  }

  setCredentials(credentials?: Credentials, _remember?: boolean) {
    this.credentials = credentials || null;
  }
}
