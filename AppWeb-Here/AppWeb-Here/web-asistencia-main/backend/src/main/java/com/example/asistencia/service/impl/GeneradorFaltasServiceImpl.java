package com.example.asistencia.service.impl;

import com.example.asistencia.entity.Asistencia;
import com.example.asistencia.entity.Colaborador;
import com.example.asistencia.entity.enums.EstadoAsistencia;
import com.example.asistencia.repository.AsistenciaRepository;
import com.example.asistencia.repository.ColaboradorRepository;
import com.example.asistencia.service.GeneradorFaltasService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class GeneradorFaltasServiceImpl implements GeneradorFaltasService {

    private final ColaboradorRepository colaboradorRepository;
    private final AsistenciaRepository asistenciaRepository;

    @Override
    public void generarFaltas(LocalDate fecha) {

        log.info("📌 Verificando faltas para la fecha {}", fecha);

        List<Colaborador> colaboradores = colaboradorRepository.findAll();
        LocalTime ahora = LocalTime.now();

        for (Colaborador c : colaboradores) {

            // 🟡 1. Validar que tenga turno
            if (c.getTurno() == null) {
                log.warn("⚠ El colaborador {} no tiene turno asignado. Se ignora.", c.getId());
                continue;
            }

            LocalTime inicioTurno = c.getTurno().getHoraInicio();

            // 🟡 2. Si el turno aún NO empezó → no evaluar
            if (ahora.isBefore(inicioTurno)) {
                log.info("⏳ Aún no inicia el turno del colaborador {}. Se ignora.", c.getId());
                continue;
            }

            // 🟡 3. Verificar si ya tiene registro de asistencia hoy
            boolean tieneAsistencia = !asistenciaRepository
                    .findByColaboradorIdAndFecha(c.getId(), fecha)
                    .isEmpty();

            if (tieneAsistencia) {
                log.info("✔ El colaborador {} ya tiene asistencia registrada. No es falta.", c.getId());
                continue;
            }

            // 🔴 4. Registrar la falta automáticamente
            log.info("❌ Registrando FALTA para colaborador {}.", c.getId());

            Asistencia falta = Asistencia.builder()
                    .colaborador(c)
                    .sede(c.getSede())
                    .fecha(fecha)
                    .estado(EstadoAsistencia.FALTA)
                    .build();

            asistenciaRepository.save(falta);
        }

        log.info("✔ Proceso de generación de faltas completado.");
    }
}
