import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccordianAuthorsComponent } from './accordian-authors.component';

describe('AccordianAuthorsComponent', () => {
  let component: AccordianAuthorsComponent;
  let fixture: ComponentFixture<AccordianAuthorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccordianAuthorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccordianAuthorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
