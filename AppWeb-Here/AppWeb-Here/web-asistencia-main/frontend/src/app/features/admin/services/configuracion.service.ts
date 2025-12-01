import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../components/models/api-response.model';

export interface Configuracion {
    id?: number;
    nombreEmpresa: string;
    ruc: string;
    direccion: string;
    horaEntradaDefault: string;
    horaSalidaDefault: string;
    toleranciaMinutos: number;
    nivelConfianzaBiometrica: number;
}

@Injectable({
    providedIn: 'root'
})
export class ConfiguracionService {
    private apiUrl = 'http://localhost:8080/api/configuracion';

    constructor(private http: HttpClient) { }

    getConfiguracion(): Observable<ApiResponse<Configuracion>> {
        return this.http.get<ApiResponse<Configuracion>>(this.apiUrl);
    }

    updateConfiguracion(configuracion: Configuracion): Observable<ApiResponse<Configuracion>> {
        return this.http.put<ApiResponse<Configuracion>>(this.apiUrl, configuracion);
    }
}
