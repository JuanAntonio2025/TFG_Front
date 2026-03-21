import { TestBed } from '@angular/core/testing';

import { Incidences } from './incidences';

describe('Incidences', () => {
  let service: Incidences;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Incidences);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
