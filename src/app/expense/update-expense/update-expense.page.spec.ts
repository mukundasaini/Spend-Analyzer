import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateExpensePage } from './update-expense.page';

describe('CreateCardsPage', () => {
  let component: UpdateExpensePage;
  let fixture: ComponentFixture<UpdateExpensePage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(UpdateExpensePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
