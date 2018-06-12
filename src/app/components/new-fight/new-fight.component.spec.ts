import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFightComponent } from './new-fight.component';

describe('NewFightComponent', () => {
  let component: NewFightComponent;
  let fixture: ComponentFixture<NewFightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewFightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewFightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
