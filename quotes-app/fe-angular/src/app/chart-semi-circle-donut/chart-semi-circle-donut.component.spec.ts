import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartSemiCircleDonutComponent } from './chart-semi-circle-donut.component';

describe('ChartSemiCircleDonutComponent', () => {
  let component: ChartSemiCircleDonutComponent;
  let fixture: ComponentFixture<ChartSemiCircleDonutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartSemiCircleDonutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartSemiCircleDonutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
