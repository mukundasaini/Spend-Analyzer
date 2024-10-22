import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterExpensePage } from './filter-expense.page';

describe('FilterCardPage', () => {
  let component: FilterExpensePage;
  let fixture: ComponentFixture<FilterExpensePage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(FilterExpensePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
