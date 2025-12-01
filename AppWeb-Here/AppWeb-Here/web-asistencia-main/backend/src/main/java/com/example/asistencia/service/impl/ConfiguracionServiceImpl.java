package com.example.asistencia.service.impl;

import com.example.asistencia.entity.Configuracion;
import com.example.asistencia.repository.ConfiguracionRepository;
import com.example.asistencia.service.ConfiguracionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;

@Service
@RequiredArgsConstructor
public class ConfiguracionServiceImpl implements ConfiguracionService {

    private final ConfiguracionRepository configuracionRepository;

    @Override
    @Transactional(readOnly = true)
    public Configuracion getConfiguracion() {
        return configuracionRepository.findAll().stream().findFirst()
                .orElseGet(() -> {
                    // Return default config if none exists
                    return Configuracion.builder()
                            .nombreEmpresa("Mi Empresa S.A.C.")
                            .ruc("20000000001")
                            .direccion("Av. Principal 123")
                            .horaEntradaDefault(LocalTime.of(9, 0))
                            .horaSalidaDefault(LocalTime.of(18, 0))
                            .toleranciaMinutos(15)
                            .nivelConfianzaBiometrica(0.70)
                            .build();
                });
    }

    @Override
    @Transactional
    public Configuracion updateConfiguracion(Configuracion configuracion) {
        Configuracion existing = configuracionRepository.findAll().stream().findFirst().orElse(null);

        if (existing == null) {
            return configuracionRepository.save(configuracion);
        } else {
            existing.setNombreEmpresa(configuracion.getNombreEmpresa());
            existing.setRuc(configuracion.getRuc());
            existing.setDireccion(configuracion.getDireccion());
            existing.setHoraEntradaDefault(configuracion.getHoraEntradaDefault());
            existing.setHoraSalidaDefault(configuracion.getHoraSalidaDefault());
            existing.setToleranciaMinutos(configuracion.getToleranciaMinutos());
            existing.setNivelConfianzaBiometrica(configuracion.getNivelConfianzaBiometrica());
            return configuracionRepository.save(existing);
        }
    }
}
