import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Asistencia, AsistenciaListItem, AsistenciaResumen, FilterRequest, MarcarEntradaDto, MarcarSalidaDto, PaginatedResponse } from '../../../components/models';


@Injectable({
    providedIn: 'root'
})
export class AsistenciaService {

    private apiUrl = `${'API_URL'}/asistencias`;

    constructor(private http: HttpClient) { }

    /**
     * Marca la entrada de un colaborador
     */
    marcarEntrada(dto: MarcarEntradaDto): Observable<ApiResponse<Asistencia>> {
        return this.http.post<ApiResponse<Asistencia>>(`${this.apiUrl}/entrada`, dto);
    }

    /**
     * Marca la salida de un colaborador
     */
    marcarSalida(dto: MarcarSalidaDto): Observable<ApiResponse<Asistencia>> {
        return this.http.post<ApiResponse<Asistencia>>(`${this.apiUrl}/salida`, dto);
    }

    /**
     * Obtiene la asistencia actual del día
     */
    getAsistenciaHoy(colaboradorId: number): Observable<ApiResponse<Asistencia | null>> {
        return this.http.get<ApiResponse<Asistencia | null>>(`${this.apiUrl}/hoy/${colaboradorId}`);
    }

    /**
     * Obtiene las asistencias de un colaborador con filtros
     */
    getAsistencias(colaboradorId: number, filterRequest?: FilterRequest): Observable<ApiResponse<PaginatedResponse<AsistenciaListItem>>> {
        let params = new HttpParams();

        if (filterRequest) {
            if (filterRequest.page !== undefined) {
                params = params.set('page', filterRequest.page.toString());
            }
            if (filterRequest.size !== undefined) {
                params = params.set('size', filterRequest.size.toString());
            }
            if (filterRequest.startDate) {
                params = params.set('startDate', filterRequest.startDate);
            }
            if (filterRequest.endDate) {
                params = params.set('endDate', filterRequest.endDate);
            }
            if (filterRequest.sort && filterRequest.sort.length > 0) {
                filterRequest.sort.forEach(sortParam => {
                    params = params.append('sort', sortParam);
                });
            }
        }

        return this.http.get<ApiResponse<PaginatedResponse<AsistenciaListItem>>>(`${this.apiUrl}/colaborador/${colaboradorId}`, { params });
    }

    /**
     * Obtiene el resumen de asistencias de un período
     */
    getResumen(colaboradorId: number, startDate: string, endDate: string): Observable<ApiResponse<AsistenciaResumen>> {
        const params = new HttpParams()
            .set('startDate', startDate)
            .set('endDate', endDate);

        return this.http.get<ApiResponse<AsistenciaResumen>>(`${this.apiUrl}/colaborador/${colaboradorId}/resumen`, { params });
    }

    /**
     * Verifica si puede marcar entrada
     */
    puedeMarcarEntrada(colaboradorId: number): Observable<ApiResponse<{ puede: boolean; mensaje: string }>> {
        return this.http.get<ApiResponse<{ puede: boolean; mensaje: string }>>(`${this.apiUrl}/puede-marcar-entrada/${colaboradorId}`);
    }

    /**
     * Verifica si puede marcar salida
     */
    puedeMarcarSalida(colaboradorId: number): Observable<ApiResponse<{ puede: boolean; mensaje: string; asistenciaId?: number }>> {
        return this.http.get<ApiResponse<{ puede: boolean; mensaje: string; asistenciaId?: number }>>(`${this.apiUrl}/puede-marcar-salida/${colaboradorId}`);
    }

    /**
     * Calcula las horas trabajadas entre dos horas
     */
    calcularHorasTrabajadas(horaEntrada: string, horaSalida: string): number {
        const [hEntrada, mEntrada] = horaEntrada.split(':').map(Number);
        const [hSalida, mSalida] = horaSalida.split(':').map(Number);

        const entrada = new Date();
        entrada.setHours(hEntrada, mEntrada, 0);

        const salida = new Date();
        salida.setHours(hSalida, mSalida, 0);

        const diffMs = salida.getTime() - entrada.getTime();
        return diffMs / (1000 * 60 * 60); // Convertir a horas
    }

    /**
     * Formatea las horas trabajadas
     */
    formatearHorasTrabajadas(horas: number): string {
        const h = Math.floor(horas);
        const m = Math.round((horas - h) * 60);
        return `${h}h ${m}m`;
    }
}