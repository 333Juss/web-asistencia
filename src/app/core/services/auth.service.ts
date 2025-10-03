import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';
import { NotificationService } from './notification.service';
// import { environment } from '@env/environment';
import { ApiResponse, Colaborador, LoginDto, LoginResponseDto, Usuario } from '../../components/models';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    //private apiUrl = `${environment.apiUrl}/auth`;
    private apiUrl = `${'API_URL'}/auth`;

    // Subject para el usuario autenticado
    private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    // Subject para el colaborador
    private currentColaboradorSubject = new BehaviorSubject<Colaborador | null>(null);
    public currentColaborador$ = this.currentColaboradorSubject.asObservable();

    constructor(
        private http: HttpClient,
        private storageService: StorageService,
        private notificationService: NotificationService,
        private router: Router
    ) {
        // Cargar datos del storage al iniciar
        this.loadStoredData();
    }

    /**
     * Carga los datos almacenados en el storage
     */
    private loadStoredData(): void {
        const user = this.storageService.getCurrentUser<Usuario>();
        const colaborador = this.storageService.getCurrentColaborador<Colaborador>();

        if (user) {
            this.currentUserSubject.next(user);
        }
        if (colaborador) {
            this.currentColaboradorSubject.next(colaborador);
        }
    }

    /**
     * Inicia sesión
     */
    login(credentials: LoginDto): Observable<ApiResponse<LoginResponseDto>> {
        return this.http.post<ApiResponse<LoginResponseDto>>(`${this.apiUrl}/login`, credentials)
            .pipe(
                tap(response => {
                    if (response.success && response.data) {
                        this.handleSuccessfulLogin(response.data);
                    }
                })
            );
    }

    /**
     * Maneja el login exitoso
     */
    private handleSuccessfulLogin(data: LoginResponseDto): void {
        // Guardar token
        this.storageService.saveToken(data.token);

        // Guardar usuario
        this.storageService.saveCurrentUser(data.usuario);
        this.currentUserSubject.next(data.usuario);

        // Guardar colaborador si existe
        if (data.colaborador) {
            this.storageService.saveCurrentColaborador(data.colaborador);
            this.currentColaboradorSubject.next(data.colaborador);
        }

        this.notificationService.success(`Bienvenido ${data.usuario.username}`);

        // Redirigir según el rol
        this.redirectByRole(data.usuario.rol);
    }

    /**
     * Redirige al usuario según su rol
     */
    private redirectByRole(rol: string): void {
        switch (rol) {
            case 'ADMIN':
            case 'RRHH':
                this.router.navigate(['/admin/dashboard']);
                break;
            case 'EMPLEADO':
                this.router.navigate(['/employee/marcar-asistencia']);
                break;
            default:
                this.router.navigate(['/']);
        }
    }

    /**
     * Cierra sesión
     */
    logout(): void {
        // Llamar al endpoint de logout si existe
        this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
            next: () => {
                this.performLogout();
            },
            error: () => {
                // Hacer logout local aunque falle el backend
                this.performLogout();
            }
        });
    }

    /**
     * Realiza el logout local
     */
    private performLogout(): void {
        this.storageService.clearAuthData();
        this.currentUserSubject.next(null);
        this.currentColaboradorSubject.next(null);
        this.notificationService.info('Sesión cerrada correctamente');
        this.router.navigate(['/auth/login']);
    }

    /**
     * Verifica si el usuario está autenticado
     */
    isAuthenticated(): boolean {
        const token = this.storageService.getToken();
        const user = this.storageService.getCurrentUser();
        return !!(token && user);
    }

    /**
     * Obtiene el usuario actual
     */
    getCurrentUser(): Usuario | null {
        return this.currentUserSubject.value;
    }

    /**
     * Obtiene el colaborador actual
     */
    getCurrentColaborador(): Colaborador | null {
        return this.currentColaboradorSubject.value;
    }

    /**
     * Verifica si el usuario tiene un rol específico
     */
    hasRole(roles: string[]): boolean {
        const user = this.getCurrentUser();
        if (!user) return false;
        return roles.includes(user.rol);
    }

    /**
     * Verifica si el usuario es administrador
     */
    isAdmin(): boolean {
        return this.hasRole(['ADMIN', 'RRHH']);
    }

    /**
     * Cambia la contraseña
     */
    changePassword(currentPassword: string, newPassword: string): Observable<ApiResponse<any>> {
        return this.http.post<ApiResponse<any>>(`${this.apiUrl}/change-password`, {
            currentPassword,
            newPassword
        }).pipe(
            tap(response => {
                if (response.success) {
                    this.notificationService.success('Contraseña actualizada correctamente');
                }
            })
        );
    }

    /**
     * Solicita recuperación de contraseña
     */
    forgotPassword(email: string): Observable<ApiResponse<any>> {
        return this.http.post<ApiResponse<any>>(`${this.apiUrl}/forgot-password`, { email })
            .pipe(
                tap(response => {
                    if (response.success) {
                        this.notificationService.success('Se ha enviado un correo con instrucciones');
                    }
                })
            );
    }

    /**
     * Refresca el token
     */
    refreshToken(): Observable<ApiResponse<{ token: string }>> {
        return this.http.post<ApiResponse<{ token: string }>>(`${this.apiUrl}/refresh-token`, {})
            .pipe(
                tap(response => {
                    if (response.success && response.data) {
                        this.storageService.saveToken(response.data.token);
                    }
                })
            );
    }

    /**
     * Verifica el token actual
     */
    verifyToken(): Observable<ApiResponse<{ valid: boolean }>> {
        return this.http.get<ApiResponse<{ valid: boolean }>>(`${this.apiUrl}/verify-token`);
    }
}