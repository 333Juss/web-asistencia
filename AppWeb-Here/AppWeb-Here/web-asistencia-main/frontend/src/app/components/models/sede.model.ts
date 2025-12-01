import { Empresa } from "./empresa.model";

export interface Sede {
    id?: number;
    empresaId: number;
    codigo: string;
    nombre: string;
    direccion?: string;
    distrito?: string;
    provincia?: string;
    departamento?: string;
    latitud?: number;
    longitud?: number;
    radioMetros: number;
    activo: boolean;
    createdAt?: Date;
    updatedAt?: Date;

    // Relaciones
    empresa?: Empresa;
    cantidadEmpleados?: number;
}

export interface SedeCreateDto {
    empresaId: number;
    codigo: string;
    nombre: string;
    direccion?: string;
    distrito?: string;
    provincia?: string;
    departamento?: string;
    latitud?: number;
    longitud?: number;
    radioMetros: number;
}

export interface SedeUpdateDto extends Partial<SedeCreateDto> {
    id: number;
}

export interface Coordenadas {
    latitud: number;
    longitud: number;
}

export interface UbicacionSede extends Coordenadas {
    radioMetros: number;
}