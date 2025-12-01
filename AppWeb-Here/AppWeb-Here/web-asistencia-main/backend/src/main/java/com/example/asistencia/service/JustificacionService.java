package com.example.asistencia.service;

import com.example.asistencia.dto.JustificacionAccionDTO;
import com.example.asistencia.dto.JustificacionAdminDTO;
import com.example.asistencia.entity.Justificacion;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface JustificacionService {

    Justificacion enviarJustificacion(Long asistenciaId, Long colaboradorId, String motivo, MultipartFile archivo);
    JustificacionAccionDTO aprobar(Long id, String respuestaSupervisor);

    JustificacionAccionDTO rechazar(Long id, String respuestaSupervisor);

    List<Justificacion> listarPorColaborador(Long colaboradorId);

    List<JustificacionAdminDTO> listarTodasDTO();
}

