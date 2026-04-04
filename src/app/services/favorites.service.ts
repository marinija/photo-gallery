import { effect, Injectable, signal, WritableSignal } from '@angular/core';
import { Photo } from '@/models/photo';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private readonly STORAGE_KEY = 'favorites';
  private _favorites: WritableSignal<Photo[]> = signal<Photo[]>([]);
  favorites = this._favorites.asReadonly();

  constructor() {
    this.restoreFavourites();
    effect(() => localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._favorites())));
  }

  toggle(photo: Photo) {
    this._favorites.update((favorite) => {
      const index = favorite.findIndex((p) => p.id === photo.id);
      if (index > -1) {
        return favorite.filter((p) => p.id !== photo.id);
      } else {
        return [...favorite, photo];
      }
    });
  }

  private restoreFavourites() {
    const items = localStorage.getItem(this.STORAGE_KEY);
    if (items) {
      try {
        const parsed = JSON.parse(items);
        this._favorites.set(parsed);
      } catch (e) {
        console.error('Failed to restore favorites:', e);
      }
    }
  }
}
