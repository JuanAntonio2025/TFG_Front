import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidencesList } from './incidences-list';

describe('IncidencesList', () => {
  let component: IncidencesList;
  let fixture: ComponentFixture<IncidencesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidencesList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncidencesList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
