import { Colaborador } from "./colaborador.model";

export interface DatosBiometricos {
    id?: number;
    colaboradorId: number;
    imagenPath: string;
    imagenUrl?: string;
    embeddings?: any; // JSON con el vector de características faciales
    calidadImagen?: number;
    fechaCaptura: Date;
    esPrincipal: boolean;
    activo: boolean;

    // Relaciones
    colaborador?: Colaborador;
}

export interface CapturarRostroDto {
    colaboradorId: number;
    imagenes: ImagenFacial[];
}

export interface ImagenFacial {
    imagenBase64: string;
    orden: number; // 1 a 5
    calidadImagen?: number;
}

export interface ValidacionImagenResponse {
    esValida: boolean;
    mensaje: string;
    calidadImagen: number;
    rostroDetectado: boolean;
    iluminacionAdecuada: boolean;
    rostroCentrado: boolean;
}

export interface RegistroBiometricoResponse {
    exito: boolean;
    mensaje: string;
    imagenesProcesadas: number;
    imagenPrincipalId?: number;
}

export interface ReconocimientoFacialDto {
    imagenBase64: string;
    colaboradorId?: number; // Si se conoce, para verificación; si no, para identificación
}

export interface ReconocimientoFacialResponse {
    coincide: boolean;
    colaboradorId?: number;
    confianza: number;
    mensaje: string;
}