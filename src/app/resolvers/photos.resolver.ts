import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { PhotosService } from '@/services/photos.service';
import { Photo } from '@/models/photo';

export const PhotosResolver: ResolveFn<Photo[]> = () => inject(PhotosService).getPhotos();
export const PhotoResolver: ResolveFn<Photo> = (route: ActivatedRouteSnapshot) => inject(PhotosService).getPhoto(route.params['id']);
