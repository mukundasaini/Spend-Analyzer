import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesAnalyticsPage } from './categories-analytics.page';

describe('AnalyticsPage', () => {
  let component: CategoriesAnalyticsPage;
  let fixture: ComponentFixture<CategoriesAnalyticsPage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(CategoriesAnalyticsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
