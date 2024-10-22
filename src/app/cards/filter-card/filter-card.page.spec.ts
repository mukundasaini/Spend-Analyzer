import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterCardPage } from './filter-card.page';

describe('FilterCardPage', () => {
  let component: FilterCardPage;
  let fixture: ComponentFixture<FilterCardPage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(FilterCardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
