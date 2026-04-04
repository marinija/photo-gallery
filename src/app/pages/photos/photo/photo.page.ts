import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Photo } from '@/models/photo';
import { NgOptimizedImage } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { LoadingComponent } from '@/components/loading/loading.component';
import { FavoritesService } from '@/services/favorites.service';

@Component({
  selector: 'section.photo',
  imports: [NgOptimizedImage, MatButton, LoadingComponent],
  templateUrl: 'photo.page.html',
  styleUrl: 'photo.page.scss',
})
export class PhotoPage {
  private readonly favoritesService = inject(FavoritesService);
  private readonly route = inject(ActivatedRoute);
  photo!: Photo;

  isFavorite = computed(() =>
    this.favoritesService.favorites().some((p) => p.id === this.photo.id),
  );

  constructor() {
    this.route.data.subscribe({
      next: (data) => (this.photo = data['photo']),
    });
  }

  removeFromFavorites() {
    if (this.isFavorite()) {
      this.favoritesService.toggle(this.photo);
    }
  }
}
