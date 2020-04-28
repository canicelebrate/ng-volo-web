import { TestBed } from '@angular/core/testing';

import { AEErrorHandlerService } from './aeerror-handler.service';

describe('AEErrorHandlerService', () => {
  let service: AEErrorHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AEErrorHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
