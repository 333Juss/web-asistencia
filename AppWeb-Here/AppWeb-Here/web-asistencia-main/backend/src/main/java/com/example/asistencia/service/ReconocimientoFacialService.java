package com.example.asistencia.service;

public interface ReconocimientoFacialService {

    /**
     * Reconoce un rostro y retorna la confianza de coincidencia
     *
     * @param colaboradorId ID del colaborador
     * @param imagenBase64 Imagen en base64
     * @return Valor de confianza entre 0 y 1
     */
    double reconocerRostro(Long colaboradorId, String imagenBase64);

    /**
     * Verifica si un rostro coincide con los datos biométricos almacenados
     *
     * @param colaboradorId ID del colaborador
     * @param imagenBase64 Imagen en base64
     * @param threshold Umbral mínimo de confianza
     * @return true si coincide, false en caso contrario
     */
    boolean verificarRostro(Long colaboradorId, String imagenBase64, double threshold);
}
