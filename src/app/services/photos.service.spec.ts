import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

import { PhotosService } from './photos.service';
import { Photo } from '@/models/photo';

const BASE_URL = 'https://picsum.photos';

const mockApiPhoto = {
  id: '1',
  author: 'Test Author',
  width: 5000,
  height: 3333,
  url: 'https://unsplash.com/photos/test',
  download_url: 'https://picsum.photos/id/1/200/300',
};

const expectedPhoto: Photo = {
  id: '1',
  author: 'Test Author',
  thumbnailUrl: `${BASE_URL}/id/1/300/400.webp`,
  fullUrl: `${BASE_URL}/id/1/1200/900.webp`,
};

describe('PhotosService', () => {
  let service: PhotosService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    vi.useFakeTimers();

    TestBed.configureTestingModule({
      providers: [PhotosService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(PhotosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    vi.useRealTimers();
    httpMock.verify();
    vi.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPhotos', () => {
    it('should call the correct endpoint with default params', () => {
      service.getPhotos().subscribe();

      const req = httpMock.expectOne(`${BASE_URL}/v2/list?page=1&limit=12`);
      expect(req.request.method).toBe('GET');
      req.flush([mockApiPhoto]);
      vi.advanceTimersByTime(300);
    });

    it('should call the correct endpoint with custom page and limit', () => {
      service.getPhotos(2, 6).subscribe();

      const req = httpMock.expectOne(`${BASE_URL}/v2/list?page=2&limit=6`);
      expect(req.request.method).toBe('GET');
      req.flush([mockApiPhoto]);
      vi.advanceTimersByTime(300);
    });

    it('should map api response to Photo model', () => {
      let result: Photo[] = [];

      service.getPhotos().subscribe((photos) => (result = photos));

      const req = httpMock.expectOne(`${BASE_URL}/v2/list?page=1&limit=12`);
      req.flush([mockApiPhoto]);
      vi.advanceTimersByTime(300);

      expect(result[0]).toEqual(expectedPhoto);
    });

    it('should return mapped array for multiple photos', () => {
      let result: Photo[] = [];
      const mockApiPhotos = [
        { ...mockApiPhoto, id: '1' },
        { ...mockApiPhoto, id: '2', author: 'Author 2' },
      ];

      service.getPhotos().subscribe((photos) => (result = photos));

      const req = httpMock.expectOne(`${BASE_URL}/v2/list?page=1&limit=12`);
      req.flush(mockApiPhotos);
      vi.advanceTimersByTime(300);

      expect(result.length).toBe(2);
      expect(result[1].id).toBe('2');
      expect(result[1].author).toBe('Author 2');
    });

    it('should construct correct thumbnailUrl', () => {
      let result: Photo[] = [];

      service.getPhotos().subscribe((photos) => (result = photos));

      const req = httpMock.expectOne(`${BASE_URL}/v2/list?page=1&limit=12`);
      req.flush([mockApiPhoto]);
      vi.advanceTimersByTime(300);

      expect(result[0].thumbnailUrl).toBe(`${BASE_URL}/id/1/300/400.webp`);
    });

    it('should construct correct fullUrl', () => {
      let result: Photo[] = [];

      service.getPhotos().subscribe((photos) => (result = photos));

      const req = httpMock.expectOne(`${BASE_URL}/v2/list?page=1&limit=12`);
      req.flush([mockApiPhoto]);
      vi.advanceTimersByTime(300);

      expect(result[0].fullUrl).toBe(`${BASE_URL}/id/1/1200/900.webp`);
    });
  });

  describe('getPhoto', () => {
    it('should call the correct endpoint with the given id', () => {
      service.getPhoto('1').subscribe();

      const req = httpMock.expectOne(`${BASE_URL}/id/1/info`);
      expect(req.request.method).toBe('GET');
      req.flush(mockApiPhoto);
    });

    it('should map api response to Photo model', () => {
      let result: Photo | undefined;

      service.getPhoto('1').subscribe((photo) => (result = photo));

      const req = httpMock.expectOne(`${BASE_URL}/id/1/info`);
      req.flush(mockApiPhoto);

      expect(result).toEqual(expectedPhoto);
    });

    it('should construct correct thumbnailUrl for single photo', () => {
      let result: Photo | undefined;

      service.getPhoto('1').subscribe((photo) => (result = photo));

      const req = httpMock.expectOne(`${BASE_URL}/id/1/info`);
      req.flush(mockApiPhoto);

      expect(result?.thumbnailUrl).toBe(`${BASE_URL}/id/1/300/400.webp`);
    });

    it('should construct correct fullUrl for single photo', () => {
      let result: Photo | undefined;

      service.getPhoto('1').subscribe((photo) => (result = photo));

      const req = httpMock.expectOne(`${BASE_URL}/id/1/info`);
      req.flush(mockApiPhoto);

      expect(result?.fullUrl).toBe(`${BASE_URL}/id/1/1200/900.webp`);
    });
  });
});
