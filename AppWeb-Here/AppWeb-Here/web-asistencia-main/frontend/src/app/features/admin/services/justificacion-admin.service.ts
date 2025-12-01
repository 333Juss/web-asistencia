import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface JustificacionPendiente {
  id: number;
  colaboradorId: number;
  nombres: string;
  apellidos: string;
  asistenciaId: number;
  fechaFalta: string;
  motivo: string;
  estado: string;
  fechaSolicitud: string;
}

@Injectable({
  providedIn: 'root'
})
export class JustificacionAdminService {

  private api = 'http://localhost:8080/api/justificaciones';

  constructor(private http: HttpClient) {}

  listarTodas(): Observable<JustificacionPendiente[]> {
    return this.http.get<JustificacionPendiente[]>(`${this.api}/todas`);
  }

  aprobar(id: number, respuestaSupervisor: string) {
    return this.http.put(`${this.api}/${id}/aprobar`, { respuestaSupervisor });
  }

  rechazar(id: number, respuestaSupervisor: string) {
    return this.http.put(`${this.api}/${id}/rechazar`, { respuestaSupervisor });
  }
}
