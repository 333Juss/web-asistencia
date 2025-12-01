package com.example.asistencia.service.impl;

import com.example.asistencia.dto.JustificacionAccionDTO;
import com.example.asistencia.dto.JustificacionAdminDTO;
import com.example.asistencia.entity.Asistencia;
import com.example.asistencia.entity.Justificacion;
import com.example.asistencia.entity.enums.EstadoAsistencia;
import com.example.asistencia.entity.enums.EstadoJustificacion;
import com.example.asistencia.exception.BadRequestException;
import com.example.asistencia.exception.ResourceNotFoundException;
import com.example.asistencia.repository.AsistenciaRepository;
import com.example.asistencia.repository.JustificacionRepository;
import com.example.asistencia.service.JustificacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;


import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
@RequiredArgsConstructor
public class JustificacionServiceImpl implements JustificacionService {

    private final JustificacionRepository justificacionRepository;
    private final AsistenciaRepository asistenciaRepository;

    @Override
    @Transactional
    public Justificacion enviarJustificacion(Long asistenciaId, Long colaboradorId, String motivo, MultipartFile archivo) {

        if (justificacionRepository.existsByAsistenciaId(asistenciaId)) {
            throw new BadRequestException("Esta falta ya tiene una justificación enviada.");
        }

        Asistencia asistencia = asistenciaRepository.findById(asistenciaId)
                .orElseThrow(() -> new ResourceNotFoundException("Asistencia no encontrada"));

        Justificacion justificacion = new Justificacion();
        justificacion.setColaborador(asistencia.getColaborador());
        justificacion.setMotivo(motivo);
        justificacion.setEstado(EstadoJustificacion.PENDIENTE);
        justificacion.setAsistencia(asistencia);
        justificacion.setFechaSolicitud(LocalDateTime.now());

        // ===========================
        // GUARDAR ARCHIVO SI EXISTE
        // ===========================
        if (archivo != null && !archivo.isEmpty()) {
            try {
                String dir = "uploads/justificaciones/";
                Files.createDirectories(Paths.get(dir));

                String filename = "justificacion_" + colaboradorId + "_" + System.currentTimeMillis()
                        + "_" + archivo.getOriginalFilename();

                Path path = Paths.get(dir + filename);
                Files.write(path, archivo.getBytes());

                justificacion.setArchivoSustento("/" + dir + filename);

            } catch (IOException e) {
                throw new RuntimeException("Error guardando archivo: " + e.getMessage());
            }
        }

        Justificacion saved = justificacionRepository.save(justificacion);

        asistencia.setEstado(EstadoAsistencia.PENDIENTE_JUSTIFICACION);
        asistenciaRepository.save(asistencia);

        return saved;
    }



    @Override
    @Transactional
    public JustificacionAccionDTO aprobar(Long id, String respuestaSupervisor) {

        Justificacion j = justificacionRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Justificación no encontrada"));

        j.setEstado(EstadoJustificacion.APROBADA);
        j.setRespuestaSupervisor(respuestaSupervisor);
        j.setFechaRespuesta(LocalDateTime.now());
        justificacionRepository.save(j);

        // 🔥 ACTUALIZAR ASISTENCIA
        Asistencia a = j.getAsistencia();
        a.setEstado(EstadoAsistencia.JUSTIFICADA);
        asistenciaRepository.save(a);

        return new JustificacionAccionDTO(
                j.getId(),
                j.getEstado().name(),
                j.getFechaRespuesta(),
                j.getRespuestaSupervisor()
        );
    }

    @Override
    @Transactional
    public JustificacionAccionDTO rechazar(Long id, String respuestaSupervisor) {

        Justificacion j = justificacionRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Justificación no encontrada"));

        j.setEstado(EstadoJustificacion.RECHAZADA);
        j.setRespuestaSupervisor(respuestaSupervisor);
        j.setFechaRespuesta(LocalDateTime.now());
        justificacionRepository.save(j);

        // 🔥 ACTUALIZAR ASISTENCIA
        Asistencia a = j.getAsistencia();
        a.setEstado(EstadoAsistencia.FALTA); // o RECHAZADA, depende de tu regla
        asistenciaRepository.save(a);

        return new JustificacionAccionDTO(
                j.getId(),
                j.getEstado().name(),
                j.getFechaRespuesta(),
                j.getRespuestaSupervisor()
        );
    }


    @Override
    public List<Justificacion> listarPorColaborador(Long colaboradorId) {
        return justificacionRepository.findByColaboradorId(colaboradorId);
    }

    @Override
    public List<JustificacionAdminDTO> listarTodasDTO() {
        return justificacionRepository.findAll().stream()
                .map(j -> JustificacionAdminDTO.builder()
                        .id(j.getId())
                        .colaboradorId(j.getColaborador().getId())
                        .nombres(j.getColaborador().getNombres())
                        .apellidos(j.getColaborador().getApellidos())
                        .asistenciaId(j.getAsistencia() != null ? j.getAsistencia().getId() : null)
                        .fechaFalta(j.getAsistencia() != null ? j.getAsistencia().getFecha() : null)
                        .motivo(j.getMotivo())
                        .estado(j.getEstado().name())
                        .fechaSolicitud(j.getFechaSolicitud())
                        .archivoSustento(j.getArchivoSustento())   // 👈🔥 AGREGAR ESTO
                        .build()
                )
                .toList();
    }
}