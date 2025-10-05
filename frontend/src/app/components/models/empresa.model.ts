export interface Empresa {
    id?: number;
    ruc: string;
    razonSocial: string;
    nombreComercial?: string;
    direccion?: string;
    ciudad?: string;
    departamento?: string;
    codigoPostal?: string;
    telefono?: string;
    categoria?: string;
    descripcion?: string;
    cantidadEmpleados?: number;
    activo: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface EmpresaCreateDto {
    ruc: string;
    razonSocial: string;
    nombreComercial?: string;
    direccion?: string;
    ciudad?: string;
    departamento?: string;
    codigoPostal?: string;
    telefono?: string;
    categoria?: string;
    descripcion?: string;
    cantidadEmpleados?: number;
}

export interface EmpresaUpdateDto extends Partial<EmpresaCreateDto> {
    id: number;
}