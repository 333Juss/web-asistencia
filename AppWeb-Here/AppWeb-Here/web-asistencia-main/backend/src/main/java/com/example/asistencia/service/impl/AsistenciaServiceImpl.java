package com.example.asistencia.service.impl;

import com.example.asistencia.dto.InasistenciaDTO;
import com.example.asistencia.dto.request.MarcarEntradaDto;
import com.example.asistencia.dto.request.MarcarSalidaDto;
import com.example.asistencia.dto.response.AsistenciaResponse;
import com.example.asistencia.entity.Asistencia;
import com.example.asistencia.entity.Colaborador;
import com.example.asistencia.entity.Justificacion;
import com.example.asistencia.entity.Sede;
import com.example.asistencia.entity.enums.EstadoAsistencia;
import com.example.asistencia.exception.ResourceNotFoundException;
import com.example.asistencia.repository.AsistenciaRepository;
import com.example.asistencia.repository.ColaboradorRepository;
import com.example.asistencia.repository.JustificacionRepository;
import com.example.asistencia.repository.SedeRepository;
import com.example.asistencia.service.AsistenciaService;
import com.example.asistencia.service.FileStorageService;
import com.example.asistencia.service.ReconocimientoFacialService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AsistenciaServiceImpl implements AsistenciaService {

    private final AsistenciaRepository asistenciaRepository;
    private final ColaboradorRepository colaboradorRepository;
    private final SedeRepository sedeRepository;
    private final JustificacionRepository justificacionRepository;
    private final ReconocimientoFacialService reconocimientoFacialService;
    private final FileStorageService fileStorageService;

    @Override
    @Transactional
    public AsistenciaResponse marcarEntrada(MarcarEntradaDto dto) {
        log.info("Marcando entrada para colaborador ID: {}", dto.getColaboradorId());

        // 1. Verificar existencia de colaborador y sede
        Colaborador colaborador = colaboradorRepository.findById(dto.getColaboradorId())
                .orElseThrow(() -> new ResourceNotFoundException("Colaborador no encontrado"));

        Sede sede = sedeRepository.findById(dto.getSedeId())
                .orElseThrow(() -> new ResourceNotFoundException("Sede no encontrada"));

        // 2. Verificar si ya marcó entrada hoy
        LocalDate hoy = LocalDate.now();
        List<Asistencia> asistenciasHoy = asistenciaRepository.findByColaboradorIdAndFecha(dto.getColaboradorId(), hoy);
        if (!asistenciasHoy.isEmpty()) {
            throw new RuntimeException("El colaborador ya marcó entrada el día de hoy");
        }

        // 3. Verificar rostro (si se envía imagen)
        // Nota: El frontend ya verifica, pero aquí podríamos re-verificar o confiar en
        // el score enviado
        // Por seguridad, guardamos la imagen
        String imagePath = null;
        if (dto.getImagenFacial() != null && !dto.getImagenFacial().isEmpty()) {
            imagePath = fileStorageService.saveBiometricImage(dto.getImagenFacial(), dto.getColaboradorId());
        }

        // 4. Crear registro de asistencia
        Asistencia asistencia = Asistencia.builder()
                .colaborador(colaborador)
                .sede(sede)
                .fecha(hoy)
                .horaEntrada(LocalTime.parse(dto.getHoraEntrada(), DateTimeFormatter.ofPattern("HH:mm")))
                .latitudEntrada(dto.getLatitud())
                .longitudEntrada(dto.getLongitud())
                .confianzaFacialEntrada(dto.getConfianzaFacial())
                .imagenEntradaPath(imagePath)
                .estado(EstadoAsistencia.INCOMPLETA)
                .build();

        Asistencia saved = asistenciaRepository.save(asistencia);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public AsistenciaResponse marcarSalida(MarcarSalidaDto dto) {
        log.info("Marcando salida para asistencia ID: {}", dto.getAsistenciaId());

        // 1. Buscar asistencia
        Asistencia asistencia = asistenciaRepository.findById(dto.getAsistenciaId())
                .orElseThrow(() -> new ResourceNotFoundException("Asistencia no encontrada"));

        if (asistencia.getHoraSalida() != null) {
            throw new RuntimeException("Ya se registró la salida para esta asistencia");
        }

        // 2. Guardar imagen si existe
        String imagePath = null;
        if (dto.getImagenFacial() != null && !dto.getImagenFacial().isEmpty()) {
            imagePath = fileStorageService.saveBiometricImage(dto.getImagenFacial(),
                    asistencia.getColaborador().getId());
        }

        // 3. Actualizar asistencia
        LocalTime horaSalida = LocalTime.parse(dto.getHoraSalida(), DateTimeFormatter.ofPattern("HH:mm"));
        asistencia.setHoraSalida(horaSalida);
        asistencia.setLatitudSalida(dto.getLatitud());
        asistencia.setLongitudSalida(dto.getLongitud());
        asistencia.setConfianzaFacialSalida(dto.getConfianzaFacial());
        asistencia.setImagenSalidaPath(imagePath);
        asistencia.setEstado(EstadoAsistencia.COMPLETA);

        // 4. Calcular horas trabajadas
        if (asistencia.getHoraEntrada() != null) {
            Duration duration = Duration.between(asistencia.getHoraEntrada(), horaSalida);
            double horas = duration.toMinutes() / 60.0;
            asistencia.setHorasTrabajadas(Math.round(horas * 100.0) / 100.0);
        }

        Asistencia saved = asistenciaRepository.save(asistencia);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public AsistenciaResponse getAsistenciaHoy(Long colaboradorId) {
        List<Asistencia> asistencias = asistenciaRepository.findByColaboradorIdAndFecha(colaboradorId, LocalDate.now());

        // Si hay múltiples registros, buscamos primero uno que ya tenga salida marcada
        // (COMPLETA)
        // Si no, buscamos uno que tenga entrada pero no salida (INCOMPLETA)
        // Si no, devolvemos el primero que encontremos
        return asistencias.stream()
                .filter(a -> a.getHoraSalida() != null)
                .findFirst()
                .or(() -> asistencias.stream().findFirst())
                .map(this::mapToResponse)
                .orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public org.springframework.data.domain.Page<AsistenciaResponse> getAsistenciasColaborador(
            Long colaboradorId,
            java.time.LocalDate startDate,
            java.time.LocalDate endDate,
            org.springframework.data.domain.Pageable pageable) {

        return asistenciaRepository.findByColaboradorIdAndFechaBetween(colaboradorId, startDate, endDate, pageable)
                .map(this::mapToResponse);
    }

    private AsistenciaResponse mapToResponse(Asistencia asistencia) {
        return AsistenciaResponse.builder()
                .id(asistencia.getId())
                .colaboradorId(asistencia.getColaborador().getId())
                .nombreColaborador(
                        asistencia.getColaborador().getNombres() + " " + asistencia.getColaborador().getApellidos())
                .sedeId(asistencia.getSede().getId())
                .nombreSede(asistencia.getSede().getNombre())
                .fecha(asistencia.getFecha())
                .horaEntrada(asistencia.getHoraEntrada())
                .horaSalida(asistencia.getHoraSalida())
                .horasTrabajadas(asistencia.getHorasTrabajadas())
                .estado(asistencia.getEstado().name())
                .confianzaEntrada(asistencia.getConfianzaFacialEntrada())
                .confianzaSalida(asistencia.getConfianzaFacialSalida())
                .build();
    }

    @Override
    public Map<String, Object> obtenerResumen(Long colaboradorId) {

        long totalAsistencias = asistenciaRepository.countByColaboradorId(colaboradorId);
        long faltas = asistenciaRepository.countByColaboradorIdAndEstado(colaboradorId, EstadoAsistencia.FALTA);
        long tardanzas = asistenciaRepository.countByColaboradorIdAndEstado(colaboradorId, EstadoAsistencia.TARDANZA);

        return Map.of(
                "totalAsistencias", totalAsistencias,
                "faltas", faltas,
                "tardanzas", tardanzas
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<AsistenciaResponse> listarInasistencias(Long colaboradorId) {

        List<Asistencia> inasistencias = asistenciaRepository.findInasistencias(colaboradorId);

        return inasistencias.stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<InasistenciaDTO> listarInasistenciasConJustificacion(Long colaboradorId) {

        // Aquí usamos findInasistencias() que ya devuelve:
        // FALTA, PENDIENTE_JUSTIFICACION, JUSTIFICADA
        List<Asistencia> inasistencias =
                asistenciaRepository.findInasistencias(colaboradorId);

        return inasistencias.stream().map(a -> {
            Justificacion j = justificacionRepository
                    .findByAsistenciaId(a.getId())
                    .orElse(null);

            return new InasistenciaDTO(
                    a.getId(),
                    a.getFecha(),
                    a.getColaborador().getTurno().getNombre(),
                    a.getEstado(),
                    j != null ? j.getEstado() : null,
                    j != null ? j.getId() : null
            );
        }).toList();
    }


}
