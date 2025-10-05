import { Usuario } from "./usuario.model";

export interface Auditoria {
    id?: number;
    usuarioId?: number;
    entidad: string;
    entidadId?: number;
    accion: AccionAuditoria;
    datosAnteriores?: any;
    datosNuevos?: any;
    ipAddress?: string;
    userAgent?: string;
    createdAt: Date;

    // Relaciones
    usuario?: Usuario;
}

export enum AccionAuditoria {
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
    LOGIN = 'LOGIN',
    LOGOUT = 'LOGOUT'
}