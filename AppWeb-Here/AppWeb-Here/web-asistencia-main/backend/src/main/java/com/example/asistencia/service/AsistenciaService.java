package com.example.asistencia.service;

import com.example.asistencia.dto.InasistenciaDTO;
import com.example.asistencia.dto.request.MarcarEntradaDto;
import com.example.asistencia.dto.request.MarcarSalidaDto;
import com.example.asistencia.dto.response.AsistenciaResponse;
import com.example.asistencia.entity.Asistencia;

import java.util.List;
import java.util.Map;

public interface AsistenciaService {

    AsistenciaResponse marcarEntrada(MarcarEntradaDto dto);

    AsistenciaResponse marcarSalida(MarcarSalidaDto dto);

    AsistenciaResponse getAsistenciaHoy(Long colaboradorId);

    Map<String, Object> obtenerResumen(Long colaboradorId);

    List<AsistenciaResponse> listarInasistencias(Long colaboradorId);

    List<InasistenciaDTO> listarInasistenciasConJustificacion(Long colaboradorId);

    org.springframework.data.domain.Page<AsistenciaResponse> getAsistenciasColaborador(
            Long colaboradorId,
            java.time.LocalDate startDate,
            java.time.LocalDate endDate,
            org.springframework.data.domain.Pageable pageable);
}
