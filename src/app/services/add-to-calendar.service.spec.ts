import { TestBed } from '@angular/core/testing';

import { AddToCalendarService } from './add-to-calendar.service';

describe('AddToCalendarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AddToCalendarService = TestBed.get(AddToCalendarService);
    expect(service).toBeTruthy();
  });
});
