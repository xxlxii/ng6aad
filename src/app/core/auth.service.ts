import * as Msal from 'msal';

import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userAgentApplication: Msal.UserAgentApplication;

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

    promise.catch(error => console.log(`loginPopup error = ${error}`));

    return from(promise);
  }

  public logout(): void {
    this.userAgentApplication.logout();
  }
}
