import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, ReconocimientoFacialDto, ReconocimientoFacialResponse } from '../../../components/models';


@Injectable({
    providedIn: 'root'
})
export class ReconocimientoFacialService {

    private apiUrl = `${'API_URL'}/reconocimiento`;

    constructor(private http: HttpClient) { }

    /**
     * Verifica si un rostro coincide con el colaborador registrado
     */
    verificarRostro(dto: ReconocimientoFacialDto): Observable<ApiResponse<ReconocimientoFacialResponse>> {
        return this.http.post<ApiResponse<ReconocimientoFacialResponse>>(`${this.apiUrl}/verificar`, dto);
    }

    /**
     * Identifica a qué colaborador pertenece un rostro
     */
    identificarRostro(imagenBase64: string): Observable<ApiResponse<ReconocimientoFacialResponse>> {
        return this.http.post<ApiResponse<ReconocimientoFacialResponse>>(`${this.apiUrl}/identificar`, {
            imagenBase64
        });
    }

    /**
     * Obtiene el nivel de confianza mínimo requerido
     */
    getConfianzaMinima(): number {
        //return environment.faceRecognitionThreshold;
        return 0.95;
    }

    /**
     * Valida si la confianza es suficiente
     */
    esConfianzaSuficiente(confianza: number): boolean {
        return confianza >= this.getConfianzaMinima();
    }
}