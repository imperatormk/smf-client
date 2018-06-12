import { TestBed, async } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
describe('ProfileComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProfileComponent
      ],
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(ProfileComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have as title 'profile'`, async(() => {
    const fixture = TestBed.createComponent(ProfileComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('profile');
  }));
  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(ProfileComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to app!');
  }));
});
