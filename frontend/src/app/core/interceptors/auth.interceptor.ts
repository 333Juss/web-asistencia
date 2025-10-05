import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { StorageService } from '../services/storage.service';

export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
    const storageService = inject(StorageService);
    const router = inject(Router);

    const token = storageService.getToken();

    if (token) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    return next(req).pipe(
        catchError((error) => {
            if (error.status === 401) {
                storageService.clearAuthData();
                router.navigate(['/auth/login']);
            }
            return throwError(() => error);
        })
    );
};