import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewsAdmin } from './reviews-admin';

describe('ReviewsAdmin', () => {
  let component: ReviewsAdmin;
  let fixture: ComponentFixture<ReviewsAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewsAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewsAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
