import { TestBed } from '@angular/core/testing';

import { NgKitService } from './ng-kit.service';

describe('NgKitService', () => {
  let service: NgKitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgKitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
