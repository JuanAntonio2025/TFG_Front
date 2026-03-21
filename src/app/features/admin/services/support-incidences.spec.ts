import { TestBed } from '@angular/core/testing';

import { SupportIncidences } from './support-incidences';

describe('SupportIncidences', () => {
  let service: SupportIncidences;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupportIncidences);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
