import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, CapturarRostroDto, DatosBiometricos, RegistroBiometricoResponse, ValidacionImagenResponse } from '../../../components/models';


@Injectable({
    providedIn: 'root'
})
export class BiometriaService {

    private apiUrl = `${'http://localhost:8080'}/biometria`;

    constructor(private http: HttpClient) { }

    /**
     * Obtiene los datos biométricos de un colaborador
     */
    getDatosBiometricos(colaboradorId: number): Observable<ApiResponse<DatosBiometricos[]>> {
        return this.http.get<ApiResponse<DatosBiometricos[]>>(`${this.apiUrl}/colaborador/${colaboradorId}`);
    }

    /**
     * Valida una imagen facial antes de capturarla
     */
    validarImagen(imagenBase64: string): Observable<ApiResponse<ValidacionImagenResponse>> {
        return this.http.post<ApiResponse<ValidacionImagenResponse>>(`${this.apiUrl}/validar-imagen`, {
            imagenBase64
        });
    }

    /**
     * Registra las imágenes faciales de un colaborador
     */
    capturarRostro(dto: CapturarRostroDto): Observable<ApiResponse<RegistroBiometricoResponse>> {
        return this.http.post<ApiResponse<RegistroBiometricoResponse>>(`${this.apiUrl}/capturar-rostro`, dto);
    }

    /**
     * Actualiza los datos biométricos de un colaborador
     */
    actualizarDatosBiometricos(colaboradorId: number, dto: CapturarRostroDto): Observable<ApiResponse<RegistroBiometricoResponse>> {
        return this.http.put<ApiResponse<RegistroBiometricoResponse>>(`${this.apiUrl}/colaborador/${colaboradorId}`, dto);
    }

    /**
     * Elimina una imagen biométrica específica
     */
    eliminarImagen(imagenId: number): Observable<ApiResponse<void>> {
        return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/imagen/${imagenId}`);
    }

    /**
     * Establece una imagen como principal
     */
    establecerImagenPrincipal(imagenId: number): Observable<ApiResponse<DatosBiometricos>> {
        return this.http.patch<ApiResponse<DatosBiometricos>>(`${this.apiUrl}/imagen/${imagenId}/principal`, {});
    }

    /**
     * Verifica si un colaborador tiene datos biométricos registrados
     */
    tieneDatosBiometricos(colaboradorId: number): Observable<ApiResponse<{ tiene: boolean; cantidad: number }>> {
        return this.http.get<ApiResponse<{ tiene: boolean; cantidad: number }>>(`${this.apiUrl}/colaborador/${colaboradorId}/check`);
    }

    /**
     * Valida la calidad de una imagen localmente (antes de enviar al servidor)
     */
    validarCalidadLocal(imagenBase64: string): Promise<{ valida: boolean; mensaje: string }> {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = imagenBase64;

            img.onload = () => {
                // Validar dimensiones mínimas
                if (img.width < 200 || img.height < 200) {
                    resolve({ valida: false, mensaje: 'La imagen es muy pequeña' });
                    return;
                }

                // Validar tamaño del archivo (aproximado)
                const sizeInKB = (imagenBase64.length * 0.75) / 1024;
                if (sizeInKB > 5000) { // 5MB
                    resolve({ valida: false, mensaje: 'La imagen es muy grande' });
                    return;
                }

                resolve({ valida: true, mensaje: 'Imagen válida' });
            };

            img.onerror = () => {
                resolve({ valida: false, mensaje: 'Error al cargar la imagen' });
            };
        });
    }
}