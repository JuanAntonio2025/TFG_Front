import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksAdmin } from './books-admin';

describe('BooksAdmin', () => {
  let component: BooksAdmin;
  let fixture: ComponentFixture<BooksAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooksAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BooksAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
