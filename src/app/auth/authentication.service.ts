import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User, LoginContext, LoginData, Credentials } from './user.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {

  constructor(
    private httpClient: HttpClient
  ) {}

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout(): Observable<any> {
    return this.httpClient.get<any>(`auth/logout`, httpOptions);
  }

  /**
   *
   * @param user
   */

  signUp(user: User): Observable<number> {
    return this.httpClient.post<number>(`auth/signup`, user, httpOptions);
  }

  /**
   *
   * @param loginContext
   */
  signIn(loginContext: LoginContext): Observable<any> {
    return this.httpClient.post<any>(`auth/signin`, loginContext, httpOptions);
  }

  getCurrentUser(): Observable<any>{
    return this.httpClient.get<any>(`user/me`, httpOptions);
  }

  getAllUsers(): Observable<any>{
    return this.httpClient.get<any>(`user/all`, httpOptions);
  }
}
