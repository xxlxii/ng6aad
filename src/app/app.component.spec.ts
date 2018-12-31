import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AuthService } from './core/auth.service';
import { MockAuthService } from './mocks/auth-service';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let service: AuthService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
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

  it('should render title in a h1 tag', () => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to Angular and Azure AD!');
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
    const spy = spyOn(service, 'logout').and.returnValue(null);

    // act
    component.logout();
    fixture.detectChanges();

    // assert
    expect(spy).toHaveBeenCalled();
  });
});
