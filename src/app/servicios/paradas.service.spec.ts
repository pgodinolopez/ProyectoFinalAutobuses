import { TestBed } from '@angular/core/testing';

import { ParadasService } from './paradas.service';

describe('ParadasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ParadasService = TestBed.get(ParadasService);
    expect(service).toBeTruthy();
  });
});
