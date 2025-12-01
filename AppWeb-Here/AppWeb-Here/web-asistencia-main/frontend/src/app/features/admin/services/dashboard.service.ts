import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../components/models/api-response.model';

export interface DashboardStats {
    totalColaboradores: number;
    asistenciasCount: number;
    tardanzasCount: number;
    ausenciasCount: number;
    asistenciaPorEstado: { [key: string]: number };
    asistenciaPorDia: { [key: string]: number };
}

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private apiUrl = 'http://localhost:8080/api/dashboard';

    constructor(private http: HttpClient) { }

    getStats(startDate?: string, endDate?: string): Observable<ApiResponse<DashboardStats>> {
        let params = {};
        if (startDate && endDate) {
            params = { startDate, endDate };
        }
        return this.http.get<ApiResponse<DashboardStats>>(`${this.apiUrl}/stats`, { params });
    }
}
