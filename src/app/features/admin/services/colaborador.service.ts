import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Colaborador, ColaboradorCreateDto, ColaboradorListItem, ColaboradorUpdateDto, FilterRequest, PaginatedResponse } from '../../../components/models';

// import { environment } from '@env/environment';

@Injectable({
    providedIn: 'root'
})
export class ColaboradorService {

    private apiUrl = `${'http://localhost:8080'}/api/colaboradores`;

    constructor(private http: HttpClient) { }

    /**
     * Obtiene todos los colaboradores con paginación y filtros
     */
    getColaboradores(filterRequest?: FilterRequest): Observable<ApiResponse<PaginatedResponse<ColaboradorListItem>>> {
        let params = new HttpParams();

        if (filterRequest) {
            if (filterRequest.page !== undefined) {
                params = params.set('page', filterRequest.page.toString());
            }
            if (filterRequest.size !== undefined) {
                params = params.set('size', filterRequest.size.toString());
            }
            if (filterRequest.search) {
                params = params.set('search', filterRequest.search);
            }
            if (filterRequest.sort && filterRequest.sort.length > 0) {
                filterRequest.sort.forEach(sortParam => {
                    params = params.append('sort', sortParam);
                });
            }
        }

        return this.http.get<ApiResponse<PaginatedResponse<ColaboradorListItem>>>(this.apiUrl, { params });
    }

    /**
     * Obtiene un colaborador por ID
     */
    getColaboradorById(id: number): Observable<ApiResponse<Colaborador>> {
        return this.http.get<ApiResponse<Colaborador>>(`${this.apiUrl}/${id}`);
    }

    /**
     * Obtiene un colaborador por DNI
     */
    getColaboradorByDni(dni: string): Observable<ApiResponse<Colaborador>> {
        return this.http.get<ApiResponse<Colaborador>>(`${this.apiUrl}/dni/${dni}`);
    }

    /**
     * Crea un nuevo colaborador
     */
    createColaborador(colaborador: ColaboradorCreateDto): Observable<ApiResponse<Colaborador>> {
        return this.http.post<ApiResponse<Colaborador>>(this.apiUrl, colaborador);
    }

    /**
     * Actualiza un colaborador existente
     */
    updateColaborador(id: number, colaborador: ColaboradorUpdateDto): Observable<ApiResponse<Colaborador>> {
        return this.http.put<ApiResponse<Colaborador>>(`${this.apiUrl}/${id}`, colaborador);
    }

    /**
     * Elimina un colaborador (soft delete)
     */
    deleteColaborador(id: number): Observable<ApiResponse<void>> {
        return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
    }

    /**
     * Activa/desactiva un colaborador
     */
    toggleColaboradorStatus(id: number, activo: boolean): Observable<ApiResponse<Colaborador>> {
        return this.http.patch<ApiResponse<Colaborador>>(`${this.apiUrl}/${id}/status`, { activo });
    }

    /**
     * Obtiene colaboradores por sede
     */
    getColaboradoresBySede(sedeId: number): Observable<ApiResponse<Colaborador[]>> {
        return this.http.get<ApiResponse<Colaborador[]>>(`${this.apiUrl}/sede/${sedeId}`);
    }

    /**
     * Verifica si un DNI ya existe
     */
    checkDniExists(dni: string, excludeId?: number): Observable<ApiResponse<{ exists: boolean }>> {
        let params = new HttpParams().set('dni', dni);
        if (excludeId) {
            params = params.set('excludeId', excludeId.toString());
        }
        return this.http.get<ApiResponse<{ exists: boolean }>>(`${this.apiUrl}/check-dni`, { params });
    }

    /**
     * Verifica si un email ya existe
     */
    checkEmailExists(email: string, excludeId?: number): Observable<ApiResponse<{ exists: boolean }>> {
        let params = new HttpParams().set('email', email);
        if (excludeId) {
            params = params.set('excludeId', excludeId.toString());
        }
        return this.http.get<ApiResponse<{ exists: boolean }>>(`${this.apiUrl}/check-email`, { params });
    }

    /**
     * Exporta colaboradores a Excel
     */
    exportToExcel(): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/export/excel`, {
            responseType: 'blob'
        });
    }

    /**
     * Obtiene estadísticas de colaboradores
     */
    getEstadisticas(): Observable<ApiResponse<any>> {
        return this.http.get<ApiResponse<any>>(`${this.apiUrl}/estadisticas`);
    }
}