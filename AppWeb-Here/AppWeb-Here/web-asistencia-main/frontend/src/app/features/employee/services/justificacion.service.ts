import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Justificacion {
  id: number;
  motivo: string;
  estado: string;
  fechaSolicitud: string;
  fechaRespuesta: string | null;
  respuestaSupervisor: string | null;
  asistencia: any;
  colaborador: any;
}

@Injectable({ providedIn: 'root' })
export class JustificacionService {

  private apiUrl = 'http://localhost:8080/api/justificaciones';

  constructor(private http: HttpClient) {}

  enviarJustificacion(asistenciaId: number, colaboradorId: number, formData: FormData) {
    return this.http.post<Justificacion>(
      `${this.apiUrl}/${asistenciaId}/colaborador/${colaboradorId}`,
      formData
    );
  }


  listarPorColaborador(colaboradorId: number) {
    return this.http.get<Justificacion[]>(`${this.apiUrl}/colaborador/${colaboradorId}`);
  }

  listarPendientes() {
    return this.http.get<Justificacion[]>(`${this.apiUrl}/pendientes`);
  }

  aprobar(id: number, respuesta: string) {
    return this.http.put(`${this.apiUrl}/${id}/aprobar`, { respuestaSupervisor: respuesta });
  }

  rechazar(id: number, respuesta: string) {
    return this.http.put(`${this.apiUrl}/${id}/rechazar`, { respuestaSupervisor: respuesta });
  }
}
