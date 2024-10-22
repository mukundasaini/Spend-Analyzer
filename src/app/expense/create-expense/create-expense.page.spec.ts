import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatEexpensePage } from './create-expense.page';

describe('CategoryCardPage', () => {
  let component: CreatEexpensePage;
  let fixture: ComponentFixture<CreatEexpensePage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(CreatEexpensePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
