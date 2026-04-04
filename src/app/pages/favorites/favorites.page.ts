import { Component, inject } from '@angular/core';
import { GridLayoutComponent } from '@/components/grid-layout/grid-layout.component';
import { PhotoCardComponent } from '@/components/photo-card/photo-card.component';
import { FavoritesService } from '@/services/favorites.service';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'section.favorites',
  imports: [GridLayoutComponent, PhotoCardComponent, MatIcon, MatButton, RouterLink],
  templateUrl: 'favorites.page.html',
  styleUrl: 'favorites.page.scss',
})
export class FavoritesPage {
  private readonly favoritesService = inject(FavoritesService);
  favoritePhotos = this.favoritesService.favorites;
}
