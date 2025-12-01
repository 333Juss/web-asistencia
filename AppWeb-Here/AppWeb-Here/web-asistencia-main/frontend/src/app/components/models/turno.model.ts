export interface Turno {
  id?: number;
  nombre: string;
  horaInicio: string;
  horaFin: string;
  toleranciaMinutos: number;
  activo: boolean;
}

