import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsYearlyAnalyticsPage } from './cards-yearly-analytics.page';

describe('AnalyticsPage', () => {
  let component: CardsYearlyAnalyticsPage;
  let fixture: ComponentFixture<CardsYearlyAnalyticsPage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(CardsYearlyAnalyticsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
