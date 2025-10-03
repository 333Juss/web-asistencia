import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptorFn } from './core/interceptors/auth.interceptor';      // ← Función
import { errorInterceptorFn } from './core/interceptors/error.interceptor';    // ← Función
import { loadingInterceptorFn } from './core/interceptors/loading.interceptor'; // ← Función
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

// Clase para traducir el paginador
class CustomPaginatorIntl extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Elementos por página:';
  override nextPageLabel = 'Página siguiente';
  override previousPageLabel = 'Página anterior';
  override firstPageLabel = 'Primera página';
  override lastPageLabel = 'Última página';

  override getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0 || pageSize === 0) {
      return `0 de ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} de ${length}`;
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([
        loadingInterceptorFn,    // ← Función
        authInterceptorFn,       // ← Función
        errorInterceptorFn       // ← Función
      ])
    ),
    { provide: MAT_DATE_LOCALE, useValue: 'es-PE' },
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }
  ]
};