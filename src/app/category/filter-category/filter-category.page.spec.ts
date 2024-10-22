import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterCategoryPage } from './filter-category.page';

describe('FilterCategoryPage', () => {
  let component: FilterCategoryPage;
  let fixture: ComponentFixture<FilterCategoryPage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(FilterCategoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
