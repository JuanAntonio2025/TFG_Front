import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppNotification } from './app-notification';

describe('AppNotification', () => {
  let component: AppNotification;
  let fixture: ComponentFixture<AppNotification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppNotification]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppNotification);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
