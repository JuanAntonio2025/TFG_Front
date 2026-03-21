import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidenceDetail } from './incidence-detail';

describe('IncidenceDetail', () => {
  let component: IncidenceDetail;
  let fixture: ComponentFixture<IncidenceDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidenceDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncidenceDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
