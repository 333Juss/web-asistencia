import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FilterRequest, Turno } from '../../../components/models';

@Injectable({ providedIn: 'root' })
export class TurnoService {

  private api = 'http://localhost:8080/api/turnos';

  constructor(private http: HttpClient) {}

  getTurnos(filter: {
    page: number,
    size: number,
    search?: string,
    sort?: string[]
  }): Observable<any> {

    let params: any = {
      page: filter.page,
      size: filter.size
    };

    if (filter.search) params.search = filter.search;
    if (filter.sort) params.sort = filter.sort;

    return this.http.get<any>(`${this.api}`, { params });
  }

  getTurnoById(id: number): Observable<any> {
    return this.http.get<any>(`${this.api}/${id}`);
  }

  createTurno(turno: Turno): Observable<any> {
    return this.http.post<any>(this.api, turno);
  }

  updateTurno(id: number, turno: Turno): Observable<any> {
    return this.http.put<any>(`${this.api}/${id}`, turno);
  }

  deleteTurno(id: number): Observable<any> {
    return this.http.delete<any>(`${this.api}/${id}`);
  }

  toggleTurnoStatus(id: number, activo: boolean): Observable<any> {
    return this.http.patch<any>(`${this.api}/${id}/estado`, { activo });
  }

  listar(): Observable<any> {
    return this.http.get<any>(`${this.api}`);
  }
}
