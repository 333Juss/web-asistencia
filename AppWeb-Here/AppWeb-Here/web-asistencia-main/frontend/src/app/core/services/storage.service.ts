import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    constructor() { }

    // ==================== LOCAL STORAGE ====================

    /**
     * Guarda un valor en localStorage
     * @param key Clave para almacenar
     * @param value Valor a almacenar (se serializa a JSON automáticamente)
     */
    setItem(key: string, value: any): void {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(key, serializedValue);
        } catch (error) {
            console.error('Error al guardar en localStorage:', error);
        }
    }

    /**
     * Obtiene un valor de localStorage
     * @param key Clave del valor a obtener
     * @returns El valor deserializado o null si no existe
     */
    getItem<T>(key: string): T | null {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error al leer de localStorage:', error);
            return null;
        }
    }

    /**
     * Elimina un valor de localStorage
     * @param key Clave del valor a eliminar
     */
    removeItem(key: string): void {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error al eliminar de localStorage:', error);
        }
    }

    /**
     * Limpia todo el localStorage
     */
    clear(): void {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Error al limpiar localStorage:', error);
        }
    }

    /**
     * Verifica si existe una clave en localStorage
     * @param key Clave a verificar
     * @returns true si existe, false si no
     */
    hasItem(key: string): boolean {
        return localStorage.getItem(key) !== null;
    }

    // ==================== SESSION STORAGE ====================

    /**
     * Guarda un valor en sessionStorage
     * @param key Clave para almacenar
     * @param value Valor a almacenar
     */
    setSessionItem(key: string, value: any): void {
        try {
            const serializedValue = JSON.stringify(value);
            sessionStorage.setItem(key, serializedValue);
        } catch (error) {
            console.error('Error al guardar en sessionStorage:', error);
        }
    }

    /**
     * Obtiene un valor de sessionStorage
     * @param key Clave del valor a obtener
     * @returns El valor deserializado o null si no existe
     */
    getSessionItem<T>(key: string): T | null {
        try {
            const item = sessionStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error al leer de sessionStorage:', error);
            return null;
        }
    }

    /**
     * Elimina un valor de sessionStorage
     * @param key Clave del valor a eliminar
     */
    removeSessionItem(key: string): void {
        try {
            sessionStorage.removeItem(key);
        } catch (error) {
            console.error('Error al eliminar de sessionStorage:', error);
        }
    }

    /**
     * Limpia todo el sessionStorage
     */
    clearSession(): void {
        try {
            sessionStorage.clear();
        } catch (error) {
            console.error('Error al limpiar sessionStorage:', error);
        }
    }

    // ==================== MÉTODOS ESPECÍFICOS DEL SISTEMA ====================

    // Token de autenticación
    saveToken(token: string): void {
        this.setItem('auth_token', token);
    }

    getToken(): string | null {
        return this.getItem<string>('auth_token');
    }

    removeToken(): void {
        this.removeItem('auth_token');
    }

    // Usuario actual
    saveCurrentUser(user: any): void {
        this.setItem('current_user', user);
    }

    getCurrentUser<T>(): T | null {
        return this.getItem<T>('current_user');
    }

    removeCurrentUser(): void {
        this.removeItem('current_user');
    }

    // Colaborador actual
    saveCurrentColaborador(colaborador: any): void {
        this.setItem('current_colaborador', colaborador);
    }

    getCurrentColaborador<T>(): T | null {
        return this.getItem<T>('current_colaborador');
    }

    removeCurrentColaborador(): void {
        this.removeItem('current_colaborador');
    }

    // Limpiar toda la sesión
    clearAuthData(): void {
        this.removeToken();
        this.removeCurrentUser();
        this.removeCurrentColaborador();
    }

    // Preferencias de usuario
    saveUserPreferences(preferences: any): void {
        this.setItem('user_preferences', preferences);
    }

    getUserPreferences<T>(): T | null {
        return this.getItem<T>('user_preferences');
    }

    // Tema (dark/light)
    saveTheme(theme: 'light' | 'dark'): void {
        this.setItem('app_theme', theme);
    }

    getTheme(): 'light' | 'dark' {
        return this.getItem<'light' | 'dark'>('app_theme') || 'light';
    }
}