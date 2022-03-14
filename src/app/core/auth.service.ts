import * as Msal from 'msal';

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from './user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userAgentApplication: Msal.UserAgentApplication;

  private _userLoggedIn: boolean;
  get userLoggedIn(): boolean {
    return this._userLoggedIn;
  }
  set userLoggedIn(value) {
    this._userLoggedIn = value;
  }

  private _user: User;
  get user() {
    if (this._user) {
      return this._user;
    } else {
      return null;
    }
  }
  set user(value) {
    this._user = value;
  }

  constructor(private httpClient: HttpClient) {
    const clientId = environment.azureAd.clientId;
    const authority = environment.azureAd.authority;

    this.userAgentApplication = new Msal.UserAgentApplication(
      clientId,
      authority,
      null
    );
  }

  public login(): Observable<string> {
    const graphScopes = ['user.read'];
    const promise = this.userAgentApplication.loginPopup(graphScopes);

    promise
      .then(_ => {
        this.userLoggedIn = true;
        this.getUser().subscribe(user => this.user = user);
      })
      .catch(error => console.log(`loginPopup error = ${error}`));

    return from(promise);
  }

  public logout(): void {
    this.userAgentApplication.logout();
    this.userLoggedIn = false;
  }

  public getUser(): Observable<User> {
    return new Observable<User>(observer => {
      const graphScopes = ['user.read'];
      const promise = this.userAgentApplication.acquireTokenSilent(graphScopes);

      promise
        .then(accessToken => {
          this.getUserFromGraph(accessToken).subscribe(user => {
            observer.next(user);
            observer.complete();
          });
        })
        .catch(error => console.log(`acquireTokenSilent error = ${error}`));
    });
  }

  private getUserFromGraph(accessToken: string): Observable<User> {
    const graphUrl = 'https://graph.microsoft.com/v1.0/me';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });

    return this.httpClient.get<User>(graphUrl, { headers: headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.log(`handleError = ${JSON.stringify(error)}`);
    return throwError(null);
  }
}
