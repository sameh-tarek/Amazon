import { TestBed } from '@angular/core/testing';

import { AmazonShopFormService } from './amazon-shop-form.service';

describe('AmazonShopFormService', () => {
  let service: AmazonShopFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmazonShopFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
