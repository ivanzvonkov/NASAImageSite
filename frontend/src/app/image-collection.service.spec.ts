import { TestBed, inject } from '@angular/core/testing';

import { ImageCollectionService } from './image-collection.service';

describe('ImageCollectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImageCollectionService]
    });
  });

  it('should be created', inject([ImageCollectionService], (service: ImageCollectionService) => {
    expect(service).toBeTruthy();
  }));
});
