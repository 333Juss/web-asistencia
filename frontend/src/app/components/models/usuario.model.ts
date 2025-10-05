import { Colaborador } from "./colaborador.model";

export interface Usuario {
    id?: number;
    colaboradorId?: number;
    username: string;
    password?: string; // Solo para creación, nunca se devuelve
    rol: RolUsuario;
    ultimoAcceso?: Date;
    intentosFallidos: number;
    bloqueado: boolean;
    activo: boolean;
    createdAt?: Date;
    updatedAt?: Date;

    // Relaciones
    colaborador?: Colaborador;

    // Token JWT
    token?: string;
}

export enum RolUsuario {
    ADMIN = 'ADMIN',
    RRHH = 'RRHH',
    EMPLEADO = 'EMPLEADO',
    SUPERVISOR = 'SUPERVISOR'
}

export interface UsuarioCreateDto {
    colaboradorId?: number;
    username: string;
    password: string;
    rol: RolUsuario;
}

export interface UsuarioUpdateDto {
    id: number;
    username?: string;
    password?: string;
    rol?: RolUsuario;
    activo?: boolean;
}

export interface LoginDto {
    username: string;
    password: string;
}

export interface LoginResponseDto {
    token: string;
    usuario: Usuario;
    colaborador?: Colaborador;
    expiresIn: number;
}

export interface ChangePasswordDto {
    usuarioId: number;
    passwordActual: string;
    passwordNuevo: string;
    passwordNuevoConfirmacion: string;
}