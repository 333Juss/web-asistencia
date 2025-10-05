import { Empresa } from "./empresa.model";
import { Sede } from "./sede.model";
import { Usuario } from "./usuario.model";

export interface Colaborador {
    id?: number;
    empresaId: number;
    sedeId?: number;
    dni: string;
    nombres: string;
    apellidos: string;
    email: string;
    telefono?: string;
    fechaNacimiento?: Date;
    fechaIngreso?: Date;
    cargo?: string;
    tieneDatosBiometricos: boolean;
    activo: boolean;
    createdAt?: Date;
    updatedAt?: Date;

    // Relaciones
    empresa?: Empresa;
    sede?: Sede;
    usuario?: Usuario;

    // Campos calculados
    nombreCompleto?: string;
    edad?: number;
    passwordTemporal: string;
    username: string;
    usuarioCreado: string;
}

export interface ColaboradorCreateDto {
    empresaId: number;
    sedeId?: number;
    dni: string;
    nombres: string;
    apellidos: string;
    email: string;
    telefono?: string;
    fechaNacimiento?: string;
    fechaIngreso?: string;
    cargo?: string;

    // Campos para crear usuario
    crearUsuario?: boolean;
    username?: string;
    passwordTemporal?: string;
}

export interface ColaboradorUpdateDto extends Partial<ColaboradorCreateDto> {
    id: number;
}

export interface ColaboradorListItem {
    id: number;
    dni: string;
    nombreCompleto: string;
    email: string;
    cargo?: string;
    sede?: string | { nombre: string; codigo: string }; // Acepta string u objeto
    tieneDatosBiometricos: boolean;
    activo: boolean;
    fechaIngreso?: Date;
}