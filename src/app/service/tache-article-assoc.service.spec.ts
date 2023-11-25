import { TestBed } from '@angular/core/testing';

import { TacheArticleAssocService } from './tache-article-assoc.service';

describe('TacheArticleAssocService', () => {
  let service: TacheArticleAssocService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TacheArticleAssocService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
