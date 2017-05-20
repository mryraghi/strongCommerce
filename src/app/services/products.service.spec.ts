/* tslint:disable:no-unused-variable */

import {inject, TestBed} from "@angular/core/testing";
import {APIService} from "./api.service";

describe('ProductsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [APIService]
    });
  });

  it('should ...', inject([APIService], (service: APIService) => {
    expect(service).toBeTruthy();
  }));
});
