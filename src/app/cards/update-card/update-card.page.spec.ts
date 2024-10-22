import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCardPage } from './update-card.page';

describe('CreateCardsPage', () => {
  let component: UpdateCardPage;
  let fixture: ComponentFixture<UpdateCardPage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(UpdateCardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
