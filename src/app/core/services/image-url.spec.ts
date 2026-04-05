import { TestBed } from '@angular/core/testing';

import { ImageUrl } from './image-url';

describe('ImageUrl', () => {
  let service: ImageUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageUrl);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
