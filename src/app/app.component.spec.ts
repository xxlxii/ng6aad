import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { AuthService } from './core/auth.service';
import { MockAuthService } from './mocks/auth-service';
import { User } from './core/user';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let service: AuthService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AppComponent],
      providers: [AuthService]
    }).overrideComponent(AuthService, {
      set: {
        providers: [ { provide: AuthService, useClass: MockAuthService }]
      }
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    service = TestBed.get(AuthService);
  }));

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'Angular and Azure AD'`, () => {
    expect(component.title).toEqual('Angular and Azure AD');
  });

  it('should render title in a h3 tag', () => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h3').textContent).toContain('Angular and Azure AD');
  });

  it('should invoke AuthService.login from AppComponent.login', () => {
    // arrange
    const spy = spyOn(service, 'login').and.callFake(() => { });

    // act
    component.login();
    fixture.detectChanges();

    // assert
    expect(spy).toHaveBeenCalled();
  });

  it('should invoke AuthService.logout from AppComponent.logout', () => {
    // arrange
    const spy = spyOn(service, 'logout').and.callFake(() => { });

    // act
    component.logout();
    fixture.detectChanges();

    // assert
    expect(spy).toHaveBeenCalled();
  });

  it(`should start offering to login`, () => {
    // act
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const loginElement = fixture.debugElement.query(By.css('nav > ul > li:nth-child(1) > a'));
      const logoutElement = fixture.debugElement.query(By.css('nav > ul > li:nth-child(2) > a'));

      // assert
      expect(loginElement).not.toBeNull();
      expect(loginElement.nativeElement.innerText).toBe('Login');
      expect(logoutElement).toBeNull();
    });
  });

  it(`should show login and hide logout when user is not logged in`, () => {
    // arrange
    const userLoggedIn = false;
    const spyUserLoggedIn = spyOnProperty(service, 'userLoggedIn', 'get').and.returnValue(userLoggedIn);

    // act
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const loginElement = fixture.debugElement.query(By.css('nav > ul > li:nth-child(1) > a'));
      const logoutElement = fixture.debugElement.query(By.css('nav > ul > li:nth-child(2) > a'));

      // assert
      expect(loginElement).not.toBeNull();
      expect(loginElement.nativeElement.innerText).toBe('Login');
      expect(logoutElement).toBeNull();
      expect(spyUserLoggedIn).toHaveBeenCalled();
    });
  });

  it(`should show logout and hide login when user is logged in`, () => {
    // arrange
    const userLoggedIn = true;
    const spyUserLoggedIn = spyOnProperty(service, 'userLoggedIn', 'get').and.returnValue(userLoggedIn);
    const userProfile = new User();
    const spyUserProfile = spyOnProperty(service, 'user', 'get').and.returnValue(userProfile);

    userProfile.givenName = 'Francisco Javier Banos Lemoine';

    // act
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const loginElement = fixture.debugElement.query(By.css('nav > ul > li:nth-child(1) > a'));
      const logoutElement = fixture.debugElement.query(By.css('nav > ul > li:nth-child(2) > a'));

      // assert
      expect(loginElement).toBeNull();
      expect(logoutElement).not.toBeNull();
      expect(logoutElement.nativeElement.innerText).toBe('Logout');
      expect(spyUserLoggedIn).toHaveBeenCalled();
      expect(spyUserProfile).toHaveBeenCalled();
    });
  });

  it(`should greet the user by her name once she is logged in`, () => {
    // arrange
    const userLoggedIn = true;
    const spyUserLoggedIn = spyOnProperty(service, 'userLoggedIn', 'get').and.returnValue(userLoggedIn);
    const userProfile = new User();
    const spyUserProfile = spyOnProperty(service, 'user', 'get').and.returnValue(userProfile);

    userProfile.givenName = 'Francisco Javier Banos Lemoine';

    // act
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const greetElement = fixture.debugElement.query(By.css('nav > ul > li:nth-child(1) > span'));
      const logoutElement = fixture.debugElement.query(By.css('nav > ul > li:nth-child(2) > a'));

      // assert
      expect(greetElement).not.toBeNull();
      expect(greetElement.nativeElement.innerText).toBe('Hola Francisco Javier Banos Lemoine!');
      expect(logoutElement).not.toBeNull();
      expect(logoutElement.nativeElement.innerText).toBe('Logout');
      expect(spyUserLoggedIn).toHaveBeenCalled();
      expect(spyUserProfile).toHaveBeenCalled();
    });
  });
});
