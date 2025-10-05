import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, FilterRequest, PaginatedResponse, Sede, SedeCreateDto, SedeUpdateDto, UbicacionSede } from '../../../components/models';

// import { environment } from '@env/environment';

@Injectable({
    providedIn: 'root'
})
export class SedeService {

    private apiUrl = `${'http://localhost:8080'}/api/sedes`;

    constructor(private http: HttpClient) { }

    /**
     * Obtiene todas las sedes con paginación y filtros
     */
    getSedes(filterRequest?: FilterRequest): Observable<ApiResponse<PaginatedResponse<Sede>>> {
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

        return this.http.get<ApiResponse<PaginatedResponse<Sede>>>(this.apiUrl, { params });
    }

    /**
     * Obtiene todas las sedes activas (sin paginación)
     */
    getSedesActivas(): Observable<ApiResponse<Sede[]>> {
        return this.http.get<ApiResponse<Sede[]>>(`${this.apiUrl}/activas`);
    }

    /**
     * Obtiene una sede por ID
     */
    getSedeById(id: number): Observable<ApiResponse<Sede>> {
        return this.http.get<ApiResponse<Sede>>(`${this.apiUrl}/${id}`);
    }

    /**
     * Obtiene una sede por código
     */
    getSedeByCodigo(codigo: string): Observable<ApiResponse<Sede>> {
        return this.http.get<ApiResponse<Sede>>(`${this.apiUrl}/codigo/${codigo}`);
    }

    /**
     * Crea una nueva sede
     */
    createSede(sede: SedeCreateDto): Observable<ApiResponse<Sede>> {
        return this.http.post<ApiResponse<Sede>>(this.apiUrl, sede);
    }

    /**
     * Actualiza una sede existente
     */
    updateSede(id: number, sede: SedeUpdateDto): Observable<ApiResponse<Sede>> {
        return this.http.put<ApiResponse<Sede>>(`${this.apiUrl}/${id}`, sede);
    }

    /**
     * Elimina una sede (soft delete)
     */
    deleteSede(id: number): Observable<ApiResponse<void>> {
        return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
    }

    /**
     * Activa/desactiva una sede
     */
    toggleSedeStatus(id: number, activo: boolean): Observable<ApiResponse<Sede>> {
        return this.http.patch<ApiResponse<Sede>>(`${this.apiUrl}/${id}/status`, { activo });
    }

    /**
     * Verifica si un código de sede ya existe
     */
    checkCodigoExists(codigo: string, excludeId?: number): Observable<ApiResponse<{ exists: boolean }>> {
        let params = new HttpParams().set('codigo', codigo);
        if (excludeId) {
            params = params.set('excludeId', excludeId.toString());
        }
        return this.http.get<ApiResponse<{ exists: boolean }>>(`${this.apiUrl}/check-codigo`, { params });
    }

    /**
     * Actualiza la ubicación GPS de una sede
     */
    updateUbicacion(id: number, ubicacion: UbicacionSede): Observable<ApiResponse<Sede>> {
        return this.http.patch<ApiResponse<Sede>>(`${this.apiUrl}/${id}/ubicacion`, ubicacion);
    }

    /**
     * Obtiene estadísticas de sedes
     */
    getEstadisticas(): Observable<ApiResponse<any>> {
        return this.http.get<ApiResponse<any>>(`${this.apiUrl}/estadisticas`);
    }

    /**
     * Valida si el radio está dentro de los límites permitidos
     */
    validateRadio(radio: number): boolean {
        return radio >= 20 && radio <= 200;
    }
}