import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ContentService } from './content.service';

describe('ContentService', () => {
  let service: ContentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(ContentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should provide fallback features when the API request fails', () => {
    service.getFeatures().subscribe((features) => {
      expect(features.length).toBeGreaterThan(0);
      expect(features[0].title).toContain('University');
    });

    const req = httpMock.expectOne('http://localhost:8080/features');
    req.flush('error', { status: 500, statusText: 'Server Error' });
  });
});
