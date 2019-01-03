import * as Msal from 'msal';

import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { IdToken } from 'msal/lib-commonjs/IdToken';

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

  private _username: string;
  get username() {
    return this._username;
  }
  set username(value) {
    this._username = value;
  }

  constructor() {
    this.userAgentApplication = new Msal.UserAgentApplication(
      'your-application-id-here',
      'https://login.microsoftonline.com/your-domain-here.onmicrosoft.com',
      null
    );
  }

  public login(): Observable<string> {
    const graphScopes = ['user.read'];
    const promise = this.userAgentApplication.loginPopup(graphScopes);

    promise
      .then(rawIdToken => {
        const idToken = new IdToken(rawIdToken);
        this.username = idToken.name;
        this.userLoggedIn = true;
      })
      .catch(error => console.log(`loginPopup error = ${error}`));

    return from(promise);
  }

  public logout(): void {
    this.userAgentApplication.logout();
    this.userLoggedIn = false;
  }
}
