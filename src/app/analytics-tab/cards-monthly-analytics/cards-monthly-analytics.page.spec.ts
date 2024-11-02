import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsMonthlyAnalyticsPage } from './cards-monthly-analytics.page';

describe('AnalyticsPage', () => {
  let component: CardsMonthlyAnalyticsPage;
  let fixture: ComponentFixture<CardsMonthlyAnalyticsPage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(CardsMonthlyAnalyticsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
