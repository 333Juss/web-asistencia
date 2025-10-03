import { Colaborador } from "./colaborador.model";
import { Sede } from "./sede.model";

export interface Asistencia {
    id?: number;
    colaboradorId: number;
    sedeId: number;
    fecha: Date;
    horaEntrada?: string; // Format: "HH:mm:ss"
    horaSalida?: string;
    latitudEntrada?: number;
    longitudEntrada?: number;
    latitudSalida?: number;
    longitudSalida?: number;
    confianzaFacialEntrada?: number;
    confianzaFacialSalida?: number;
    imagenEntradaPath?: string;
    imagenSalidaPath?: string;
    horasTrabajadas?: number;
    estado: EstadoAsistencia;
    observaciones?: string;
    createdAt?: Date;
    updatedAt?: Date;

    // Relaciones
    colaborador?: Colaborador;
    sede?: Sede;
}

export enum EstadoAsistencia {
    COMPLETA = 'COMPLETA',
    INCOMPLETA = 'INCOMPLETA',
    TARDANZA = 'TARDANZA',
    FALTA = 'FALTA'
}

export interface MarcarEntradaDto {
    colaboradorId: number;
    sedeId: number;
    fecha: string; // ISO date format
    horaEntrada: string;
    latitud: number;
    longitud: number;
    imagenFacial: string; // Base64
    confianzaFacial: number;
}

export interface MarcarSalidaDto {
    asistenciaId: number;
    horaSalida: string;
    latitud: number;
    longitud: number;
    imagenFacial: string; // Base64
    confianzaFacial: number;
}

export interface AsistenciaListItem {
    id: number;
    colaboradorNombre: string;
    sedeName: string;
    fecha: Date;
    horaEntrada?: string;
    horaSalida?: string;
    horasTrabajadas?: number;
    estado: EstadoAsistencia;
}

export interface AsistenciaResumen {
    totalDias: number;
    diasCompletos: number;
    diasIncompletos: number;
    tardanzas: number;
    faltas: number;
    totalHorasTrabajadas: number;
    promedioHorasDiarias: number;
}