import { Colaborador } from "./colaborador.model";

export interface Horario {
    id?: number;
    colaboradorId: number;
    diaSemana: DiaSemana;
    horaInicio: string; // Format: "HH:mm:ss"
    horaFin: string;
    activo: boolean;
    createdAt?: Date;

    // Relaciones
    colaborador?: Colaborador;
}

export enum DiaSemana {
    LUNES = 1,
    MARTES = 2,
    MIERCOLES = 3,
    JUEVES = 4,
    VIERNES = 5,
    SABADO = 6,
    DOMINGO = 7
}

export interface HorarioCreateDto {
    colaboradorId: number;
    diaSemana: DiaSemana;
    horaInicio: string;
    horaFin: string;
}

export interface HorarioUpdateDto extends Partial<HorarioCreateDto> {
    id: number;
}

export interface HorarioSemanal {
    colaboradorId: number;
    horarios: Horario[];
}