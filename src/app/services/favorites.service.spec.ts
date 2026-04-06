import { TestBed } from '@angular/core/testing';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

import { FavoritesService } from './favorites.service';
import { Photo } from '@/models/photo';

const mockPhoto1: Photo = {
  id: '1',
  author: 'Author 1',
  thumbnailUrl: 'https://picsum.photos/id/1/300/400.webp',
  fullUrl: 'https://picsum.photos/id/1/1200/900.webp',
};

const mockPhoto2: Photo = {
  id: '2',
  author: 'Author 2',
  thumbnailUrl: 'https://picsum.photos/id/2/300/400.webp',
  fullUrl: 'https://picsum.photos/id/2/1200/900.webp',
};

describe('FavoritesService', () => {
  let service: FavoritesService;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoritesService);
  });

  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('toggle', () => {
    it('should add a photo to favorites when not already present', () => {
      service.toggle(mockPhoto1);
      expect(service.favorites()).toContainEqual(mockPhoto1);
    });

    it('should remove a photo from favorites when already present', () => {
      service.toggle(mockPhoto1);
      service.toggle(mockPhoto1);
      expect(service.favorites()).not.toContainEqual(mockPhoto1);
    });

    it('should add multiple different photos', () => {
      service.toggle(mockPhoto1);
      service.toggle(mockPhoto2);
      expect(service.favorites().length).toBe(2);
    });

    it('should only remove the toggled photo leaving others intact', () => {
      service.toggle(mockPhoto1);
      service.toggle(mockPhoto2);
      service.toggle(mockPhoto1);

      expect(service.favorites()).not.toContainEqual(mockPhoto1);
      expect(service.favorites()).toContainEqual(mockPhoto2);
    });
  });

  describe('localStorage persistence', () => {
    it('should persist favorites to localStorage on toggle', () => {
      TestBed.tick();
      service.toggle(mockPhoto1);
      TestBed.tick();

      const stored = JSON.parse(localStorage.getItem('favorites')!);
      expect(stored).toContainEqual(mockPhoto1);
    });

    it('should remove photo from localStorage when toggled off', () => {
      service.toggle(mockPhoto1);
      TestBed.tick();
      service.toggle(mockPhoto1);
      TestBed.tick();

      const stored = JSON.parse(localStorage.getItem('favorites')!);
      expect(stored).not.toContainEqual(mockPhoto1);
    });

    it('should restore favorites from localStorage on init', () => {
      localStorage.setItem('favorites', JSON.stringify([mockPhoto1, mockPhoto2]));

      // re-create service to trigger restoreFavourites
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({});
      const freshService = TestBed.inject(FavoritesService);

      expect(freshService.favorites()).toContainEqual(mockPhoto1);
      expect(freshService.favorites()).toContainEqual(mockPhoto2);
    });

    it('should handle corrupted localStorage gracefully', () => {
      localStorage.setItem('favorites', 'invalid-json');

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({});
      const freshService = TestBed.inject(FavoritesService);

      expect(freshService.favorites()).toEqual([]);
    });

    it('should start with empty favorites when localStorage is empty', () => {
      expect(service.favorites()).toEqual([]);
    });
  });
});
