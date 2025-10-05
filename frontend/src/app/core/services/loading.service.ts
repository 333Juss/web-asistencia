import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {

    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$: Observable<boolean> = this.loadingSubject.asObservable();

    private requestCount = 0;

    constructor() { }

    /**
     * Muestra el indicador de carga
     */
    show(): void {
        this.requestCount++;
        if (this.requestCount === 1) {
            this.loadingSubject.next(true);
        }
    }

    /**
     * Oculta el indicador de carga
     */
    hide(): void {
        this.requestCount--;
        if (this.requestCount <= 0) {
            this.requestCount = 0;
            this.loadingSubject.next(false);
        }
    }

    /**
     * Fuerza ocultar el indicador de carga
     */
    forceHide(): void {
        this.requestCount = 0;
        this.loadingSubject.next(false);
    }

    /**
     * Obtiene el estado actual de carga
     */
    isLoading(): boolean {
        return this.loadingSubject.value;
    }
}