/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FinancialService } from './financial.service';

describe('Service: Financial', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FinancialService]
    });
  });

  it('should ...', inject([FinancialService], (service: FinancialService) => {
    expect(service).toBeTruthy();
  }));
});
