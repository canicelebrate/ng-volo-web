import { TestBed } from '@angular/core/testing';

import { AEErrorHandler } from './aeerror-handler.service';

describe('AEErrorHandlerService', () => {
  let service: AEErrorHandler;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AEErrorHandler);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
