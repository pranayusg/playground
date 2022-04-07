import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserHeadingComponent } from './user-heading.component';

describe('UserHeadingComponent', () => {
  let component: UserHeadingComponent;
  let fixture: ComponentFixture<UserHeadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserHeadingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserHeadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
