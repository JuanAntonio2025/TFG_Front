import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidencesAdmin } from './incidences-admin';

describe('IncidencesAdmin', () => {
  let component: IncidencesAdmin;
  let fixture: ComponentFixture<IncidencesAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidencesAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncidencesAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
