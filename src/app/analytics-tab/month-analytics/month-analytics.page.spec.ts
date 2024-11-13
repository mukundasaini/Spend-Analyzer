import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthAnalyticsPage } from './month-analytics.page';

describe('AnalyticsPage', () => {
  let component: MonthAnalyticsPage;
  let fixture: ComponentFixture<MonthAnalyticsPage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(MonthAnalyticsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
