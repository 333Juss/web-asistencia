import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { Coordenadas } from '../../components/models';


// Interfaz personalizada para evitar conflicto con el tipo nativo
export interface UserLocation {
    latitude: number;
    longitude: number;
    accuracy: number;
    altitude?: number | null;
    altitudeAccuracy?: number | null;
    heading?: number | null;
    speed?: number | null;
    timestamp: number;
}

export interface GeolocationError {
    code: number;
    message: string;
}

@Injectable({
    providedIn: 'root'
})
export class GeolocationService {

    private readonly options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    };

    constructor() { }

    /**
     * Obtiene la posición actual del usuario
     * @returns Observable con las coordenadas o error
     */
    getCurrentPosition(): Observable<UserLocation> {
        return new Observable((observer: Observer<UserLocation>) => {
            if (!this.isGeolocationSupported()) {
                observer.error({
                    code: 0,
                    message: 'La geolocalización no está soportada en este navegador'
                });
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position: GeolocationPosition) => {
                    observer.next(this.mapToUserLocation(position));
                    observer.complete();
                },
                (error: GeolocationPositionError) => {
                    observer.error(this.handleGeolocationError(error));
                },
                this.options
            );
        });
    }

    /**
     * Observa continuamente la posición del usuario
     * @returns Observable que emite las coordenadas cada vez que cambian
     */
    watchPosition(): Observable<UserLocation> {
        return new Observable((observer: Observer<UserLocation>) => {
            if (!this.isGeolocationSupported()) {
                observer.error({
                    code: 0,
                    message: 'La geolocalización no está soportada en este navegador'
                });
                return;
            }

            const watchId = navigator.geolocation.watchPosition(
                (position: GeolocationPosition) => {
                    observer.next(this.mapToUserLocation(position));
                },
                (error: GeolocationPositionError) => {
                    observer.error(this.handleGeolocationError(error));
                },
                this.options
            );

            // Cleanup function
            return () => {
                navigator.geolocation.clearWatch(watchId);
            };
        });
    }

    /**
     * Mapea la posición nativa del navegador a nuestra interfaz
     * @param position Posición nativa de GeolocationPosition
     * @returns UserLocation
     */
    private mapToUserLocation(position: GeolocationPosition): UserLocation {
        return {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            altitudeAccuracy: position.coords.altitudeAccuracy,
            heading: position.coords.heading,
            speed: position.coords.speed,
            timestamp: position.timestamp
        };
    }

    /**
     * Calcula la distancia entre dos puntos geográficos usando la fórmula de Haversine
     * @param lat1 Latitud del punto 1
     * @param lon1 Longitud del punto 1
     * @param lat2 Latitud del punto 2
     * @param lon2 Longitud del punto 2
     * @returns Distancia en metros
     */
    calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const R = 6371000; // Radio de la Tierra en metros
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Distancia en metros
    }

    /**
     * Verifica si el usuario está dentro del radio permitido de una ubicación
     * @param userLat Latitud del usuario
     * @param userLon Longitud del usuario
     * @param targetLat Latitud del objetivo (sede)
     * @param targetLon Longitud del objetivo
     * @param radiusMeters Radio permitido en metros
     * @returns true si está dentro del radio, false si no
     */
    isWithinRadius(
        userLat: number,
        userLon: number,
        targetLat: number,
        targetLon: number,
        radiusMeters: number
    ): boolean {
        const distance = this.calculateDistance(userLat, userLon, targetLat, targetLon);
        return distance <= radiusMeters;
    }

    /**
     * Obtiene la distancia del usuario a una ubicación objetivo
     * @param userLat Latitud del usuario
     * @param userLon Longitud del usuario
     * @param targetLat Latitud del objetivo
     * @param targetLon Longitud del objetivo
     * @returns Distancia en metros y si está dentro del radio
     */
    getDistanceInfo(
        userLat: number,
        userLon: number,
        targetLat: number,
        targetLon: number,
        radiusMeters: number
    ): { distance: number; isWithin: boolean; message: string } {
        const distance = this.calculateDistance(userLat, userLon, targetLat, targetLon);
        const isWithin = distance <= radiusMeters;

        let message: string;
        if (isWithin) {
            message = `Estás a ${distance.toFixed(0)} metros de la sede`;
        } else {
            const excess = distance - radiusMeters;
            message = `Estás a ${distance.toFixed(0)} metros. Necesitas acercarte ${excess.toFixed(0)} metros más`;
        }

        return { distance, isWithin, message };
    }

    /**
     * Verifica si la API de Geolocalización está soportada
     * @returns true si está soportada, false si no
     */
    isGeolocationSupported(): boolean {
        return 'geolocation' in navigator;
    }

    /**
     * Solicita permiso para acceder a la ubicación
     * @returns Promise que resuelve true si se concede el permiso
     */
    async requestPermission(): Promise<boolean> {
        if (!this.isGeolocationSupported()) {
            return false;
        }

        try {
            // Intentar usar la API de permisos si está disponible
            if ('permissions' in navigator) {
                const result = await navigator.permissions.query({ name: 'geolocation' });
                return result.state === 'granted' || result.state === 'prompt';
            }

            // Fallback: intentar obtener la posición directamente
            return new Promise((resolve) => {
                navigator.geolocation.getCurrentPosition(
                    () => resolve(true),
                    () => resolve(false),
                    { timeout: 5000 }
                );
            });
        } catch (error) {
            console.error('Error al verificar permisos de geolocalización:', error);
            return false;
        }
    }

    /**
     * Verifica el estado del permiso de geolocalización
     * @returns Promise con el estado: 'granted', 'denied', 'prompt', o 'unavailable'
     */
    async checkPermissionState(): Promise<'granted' | 'denied' | 'prompt' | 'unavailable'> {
        if (!this.isGeolocationSupported()) {
            return 'unavailable';
        }

        try {
            if ('permissions' in navigator) {
                const result = await navigator.permissions.query({ name: 'geolocation' });
                return result.state as 'granted' | 'denied' | 'prompt';
            }
            return 'prompt';
        } catch (error) {
            return 'unavailable';
        }
    }

    /**
     * Maneja los errores de geolocalización
     * @param error Error de geolocalización
     * @returns Objeto con código y mensaje de error
     */
    private handleGeolocationError(error: GeolocationPositionError): GeolocationError {
        let message: string;

        switch (error.code) {
            case error.PERMISSION_DENIED:
                message = 'El permiso de ubicación fue denegado. Por favor habilítalo en la configuración de tu navegador.';
                break;
            case error.POSITION_UNAVAILABLE:
                message = 'La información de ubicación no está disponible. Verifica tu conexión GPS.';
                break;
            case error.TIMEOUT:
                message = 'Se agotó el tiempo de espera para obtener la ubicación. Intenta nuevamente.';
                break;
            default:
                message = 'Ocurrió un error desconocido al obtener la ubicación';
        }

        return {
            code: error.code,
            message: message
        };
    }

    /**
     * Convierte UserLocation a formato Coordenadas (modelo del sistema)
     * @param location Ubicación del usuario
     * @returns Objeto Coordenadas
     */
    toCoordenadasModel(location: UserLocation): Coordenadas {
        return {
            latitud: location.latitude,
            longitud: location.longitude
        };
    }

    /**
     * Obtiene la ubicación como texto legible usando Nominatim (OpenStreetMap)
     * Nota: En producción, considera usar Google Maps Geocoding API para mejor precisión
     * @param lat Latitud
     * @param lon Longitud
     * @returns Promise con la dirección o null
     */
    async getAddressFromCoordinates(lat: number, lon: number): Promise<string | null> {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
                {
                    headers: {
                        'User-Agent': 'HEREAttendanceApp/1.0'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Construir dirección más legible
            const address = data.address;
            if (address) {
                const parts = [
                    address.road,
                    address.suburb || address.neighbourhood,
                    address.city || address.town || address.village,
                    address.state
                ].filter(Boolean);

                return parts.join(', ') || data.display_name;
            }

            return data.display_name || null;
        } catch (error) {
            console.error('Error al obtener dirección:', error);
            return null;
        }
    }

    /**
     * Formatea una distancia en metros a un formato legible
     * @param meters Distancia en metros
     * @returns String formateado (ej: "150 m" o "1.2 km")
     */
    formatDistance(meters: number): string {
        if (meters < 1000) {
            return `${Math.round(meters)} m`;
        } else {
            return `${(meters / 1000).toFixed(1)} km`;
        }
    }
}