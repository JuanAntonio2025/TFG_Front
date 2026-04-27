import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutCancel } from './checkout-cancel';

describe('CheckoutCancel', () => {
  let component: CheckoutCancel;
  let fixture: ComponentFixture<CheckoutCancel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutCancel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckoutCancel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
