import { Routes } from '@angular/router';
import { PhotoResolver, PhotosResolver } from './resolvers/photos.resolver';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/photos/photos.page').then((c) => c.PhotosPage),
    resolve: {
      photos: PhotosResolver,
    },
  },
  {
    path: 'favorites',
    loadComponent: () => import('./pages/favorites/favorites.page').then((c) => c.FavoritesPage),
  },
  {
    path: 'photos/:id',
    loadComponent: () => import('./pages/photos/photo/photo.page').then((c) => c.PhotoPage),
    resolve: {
      photo: PhotoResolver,
    }
  },
  { path: '**', redirectTo: '' },
];
