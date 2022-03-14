import { Component } from '@angular/core';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Angular and Azure AD';

  get userLoggedIn() {
    return this.authService.userLoggedIn;
  }

  get username() {
    if (this.authService.user) {
      return this.authService.user.givenName;
    } else {
      return null;
    }
  }

  constructor(private authService: AuthService) {
  }

  login(): void {
    this.authService.login();
  }

  logout(): void {
    this.authService.logout();
  }
}
