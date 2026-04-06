import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, RouterLink } from '@angular/router';
import { signal } from '@angular/core';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

import { PhotoCardComponent } from './photo-card.component';
import { FavoritesService } from '@/services/favorites.service';
import { Photo } from '@/models/photo';

const mockPhoto: Photo = {
  id: '1',
  author: 'Test Author',
  thumbnailUrl: 'https://picsum.photos/id/1/300/400.webp',
  fullUrl: 'https://picsum.photos/id/1/1200/900.webp',
};

const mockFavoritesService = {
  favorites: signal<Photo[]>([]),
  toggle: vi.fn(),
};

describe('PhotoCardComponent', () => {
  let component: PhotoCardComponent;
  let fixture: ComponentFixture<PhotoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoCardComponent],
      providers: [provideRouter([]), { provide: FavoritesService, useValue: mockFavoritesService }],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoCardComponent);
    fixture.componentRef.setInput('photo', mockPhoto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    mockFavoritesService.favorites.set([]);
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the photo image', () => {
    const img = fixture.debugElement.query(By.css('img'));
    expect(img).toBeTruthy();
  });

  it('should render the author as alt text', () => {
    const img = fixture.debugElement.query(By.css('img'));
    expect(img.attributes['alt']).toBe(mockPhoto.author);
  });

  it('should show favorite_border icon when not a favorite', () => {
    mockFavoritesService.favorites.set([]);
    fixture.detectChanges();

    const icon = fixture.debugElement.query(By.css('mat-icon'));
    expect(icon.nativeElement.textContent.trim()).toBe('favorite_border');
  });

  it('should show favorite icon when photo is in favorites', () => {
    mockFavoritesService.favorites.set([mockPhoto]);
    fixture.detectChanges();

    const icon = fixture.debugElement.query(By.css('mat-icon'));
    expect(icon.nativeElement.textContent.trim()).toBe('favorite');
  });

  it('should call toggle with the photo when icon is clicked', () => {
    const icon = fixture.debugElement.query(By.css('mat-icon'));
    icon.nativeElement.click();
    fixture.detectChanges();

    expect(mockFavoritesService.toggle).toHaveBeenCalledWith(mockPhoto);
  });

  it('should call toggle only once per click', () => {
    const icon = fixture.debugElement.query(By.css('mat-icon'));
    icon.nativeElement.click();

    expect(mockFavoritesService.toggle).toHaveBeenCalledTimes(1);
  });

  it('should prevent default on icon click', () => {
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    vi.spyOn(event, 'preventDefault');

    component.onClick(event);

    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should stop propagation on icon click', () => {
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    vi.spyOn(event, 'stopPropagation');

    component.onClick(event);

    expect(event.stopPropagation).toHaveBeenCalled();
  });

  it('should render anchor with correct router link', () => {
    const anchor = fixture.debugElement.query(By.css('a'));
    expect(anchor).toBeTruthy();
    expect(anchor.nativeElement.getAttribute('href')).toContain(mockPhoto.id);
  });
});
