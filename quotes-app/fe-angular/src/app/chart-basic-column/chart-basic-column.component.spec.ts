import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartBasicColumnComponent } from './chart-basic-column.component';

describe('ChartBasicColumnComponent', () => {
  let component: ChartBasicColumnComponent;
  let fixture: ComponentFixture<ChartBasicColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartBasicColumnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartBasicColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
