import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Photo } from '@/models/photo';

@Injectable({
  providedIn: 'root',
})
export class PhotosService {
  private readonly BASE_URL = 'https://picsum.photos';
  private http = inject(HttpClient);

  getPhotos(page = 1, limit = 12): Observable<Photo[]> {
    return this.http.get<Photo[]>(`${this.BASE_URL}/v2/list?page=${page}&limit=${limit}`).pipe(
      map((photos) =>
        photos.map((photo) => ({
          id: photo.id,
          author: photo.author,
          thumbnailUrl: `${this.BASE_URL}/id/${photo.id}/300/400.webp`,
          fullUrl: `${this.BASE_URL}/id/${photo.id}/1200/900.webp`,
        })),
      ),
      delay(Math.floor(Math.random() * 100) + 200),
    );
  }

  getPhoto(id: string): Observable<Photo> {
    return this.http.get<any>(`${this.BASE_URL}/id/${id}/info`).pipe(
      map((photo) => ({
        id: photo.id,
        author: photo.author,
        thumbnailUrl: `${this.BASE_URL}/id/${photo.id}/300/400.webp`,
        fullUrl: `${this.BASE_URL}/id/${photo.id}/1200/900.webp`,
      })),
    );
  }
}
