import { Component, DestroyRef, inject, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PhotoCardComponent } from '@/components/photo-card/photo-card.component';
import { LoadingComponent } from '@/components/loading/loading.component';
import { Photo } from '@/models/photo';
import { GridLayoutComponent } from '@/components/grid-layout/grid-layout.component';
import { InfiniteScrollDirective } from '@/directives/infinite-scroll.directive';
import { PhotosService } from '@/services/photos.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'section.photos',
  imports: [
    PhotoCardComponent,
    LoadingComponent,
    GridLayoutComponent,
    InfiniteScrollDirective,
    InfiniteScrollDirective,
  ],
  templateUrl: 'photos.page.html',
  styleUrl: 'photos.page.scss',
})
export class PhotosPage {
  private readonly photosService = inject(PhotosService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  photos: WritableSignal<Photo[]> = signal<Photo[]>([]);
  loading = false;
  page = 1;

  constructor() {
    this.route.data.subscribe((data) => (this.photos.set(data['photos'])));
  }

  loadMore() {
    if (this.loading) return;
    this.loading = true;
    this.photosService.getPhotos(this.page + 1).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (photos) => {
        this.photos.update((currentPhotos) => [...currentPhotos, ...photos]);
        this.page++;
      },
      error: (err) => {
        console.error('Error fetching photos:', err);
      },
    }).add(() => this.loading = false);
  }
}
