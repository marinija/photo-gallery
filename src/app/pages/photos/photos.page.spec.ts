import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

import { PhotosPage } from './photos.page';
import { PhotosService } from '@/services/photos.service';
import { Photo } from '@/models/photo';

const mockPhotosPage1: Photo[] = [
  {
    id: '1',
    author: 'Author 1',
    thumbnailUrl: 'https://picsum.photos/id/1/300/400.webp',
    fullUrl: 'https://picsum.photos/id/1/1200/900.webp',
  },
  {
    id: '2',
    author: 'Author 2',
    thumbnailUrl: 'https://picsum.photos/id/2/300/400.webp',
    fullUrl: 'https://picsum.photos/id/2/1200/900.webp',
  },
];

const mockPhotosPage2: Photo[] = [
  {
    id: '3',
    author: 'Author 3',
    thumbnailUrl: 'https://picsum.photos/id/3/300/400.webp',
    fullUrl: 'https://picsum.photos/id/3/1200/900.webp',
  },
  {
    id: '4',
    author: 'Author 4',
    thumbnailUrl: 'https://picsum.photos/id/4/300/400.webp',
    fullUrl: 'https://picsum.photos/id/4/1200/900.webp',
  },
];

const mockPhotosService = {
  getPhotos: vi.fn().mockReturnValue(of(mockPhotosPage2)),
};

const mockActivatedRoute = {
  data: of({ photos: mockPhotosPage1 }),
};

class MockIntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  constructor() {}
}

describe('PhotosPage', () => {
  let component: PhotosPage;
  let fixture: ComponentFixture<PhotosPage>;

  beforeEach(async () => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

    await TestBed.configureTestingModule({
      imports: [PhotosPage],
      providers: [
        { provide: PhotosService, useValue: mockPhotosService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load initial photos from route data', () => {
    expect(component.photos()).toEqual(mockPhotosPage1);
  });

  it('should append new photos on loadMore', () => {
    component.loadMore();
    fixture.detectChanges();

    expect(component.photos()).toEqual([...mockPhotosPage1, ...mockPhotosPage2]);
  });

  it('should increment page after loadMore', () => {
    const initialPage = component.page;
    component.loadMore();

    expect(component.page).toBe(initialPage + 1);
  });

  it('should set loading to true while fetching', () => {
    const subject = new Subject<Photo[]>();
    mockPhotosService.getPhotos.mockReturnValue(subject.asObservable());

    component.loadMore();

    expect(component.loading).toBe(true);
  });

  it('should not call getPhotos if already loading', () => {
    component.loading = true;
    component.loadMore();

    expect(mockPhotosService.getPhotos).not.toHaveBeenCalled();
  });
});
