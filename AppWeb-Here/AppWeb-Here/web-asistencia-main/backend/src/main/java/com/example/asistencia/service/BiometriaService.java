package com.example.asistencia.service;

import com.example.asistencia.dto.request.CapturarRostroDto;
import com.example.asistencia.dto.response.RegistroBiometricoResponse;
import com.example.asistencia.entity.DatosBiometricos;

import java.util.List;

public interface BiometriaService {

    /**
     * Captura y registra múltiples imágenes faciales de un colaborador
     */
    RegistroBiometricoResponse capturarRostro(CapturarRostroDto dto);

    /**
     * Obtiene los datos biométricos de un colaborador
     */
    List<DatosBiometricos> obtenerDatosBiometricos(Long colaboradorId);

    /**
     * Valida una imagen facial
     */
    boolean validarImagen(String imagenBase64);

    /**
     * Elimina los datos biométricos de un colaborador
     */
    void eliminarDatosBiometricos(Long colaboradorId);

    boolean tieneDatosBiometricos(Long colaboradorId);
}
