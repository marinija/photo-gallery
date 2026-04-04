import { Component, computed, inject, input } from '@angular/core';
import { Photo } from '@/models/photo';
import { MatCard, MatCardImage } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { FavoritesService } from '@/services/favorites.service';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'photo-card',
  imports: [MatCard, MatIcon, MatCardImage, RouterLink, NgOptimizedImage],
  templateUrl: 'photo-card.component.html',
  styleUrl: 'photo-card.component.scss',
})
export class PhotoCardComponent {
  photo = input.required<Photo>();
  index = input<number>();
  favoritesService = inject(FavoritesService);

  isFavorite = computed(() =>
    this.favoritesService.favorites().some((p) => p.id === this.photo().id),
  );

  onClick(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.favoritesService.toggle(this.photo());
  }
}
