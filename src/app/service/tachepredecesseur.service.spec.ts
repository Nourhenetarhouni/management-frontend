import { TestBed } from '@angular/core/testing';

import { TachepredecesseurService } from './tachepredecesseur.service';

describe('TachepredecesseurService', () => {
  let service: TachepredecesseurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TachepredecesseurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
