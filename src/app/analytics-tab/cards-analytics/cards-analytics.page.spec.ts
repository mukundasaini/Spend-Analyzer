import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsAnalyticsPage } from './cards-analytics.page';

describe('AnalyticsPage', () => {
  let component: CardsAnalyticsPage;
  let fixture: ComponentFixture<CardsAnalyticsPage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(CardsAnalyticsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
