import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCardPage } from './create-card.page';

describe('CreateCardsPage', () => {
  let component: CreateCardPage;
  let fixture: ComponentFixture<CreateCardPage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(CreateCardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
