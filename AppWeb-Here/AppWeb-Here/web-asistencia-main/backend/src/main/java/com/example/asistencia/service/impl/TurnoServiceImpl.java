package com.example.asistencia.service.impl;

import com.example.asistencia.entity.Turno;
import com.example.asistencia.repository.TurnoRepository;
import com.example.asistencia.service.TurnoService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TurnoServiceImpl implements TurnoService {

    private final TurnoRepository turnoRepository;

    @Override
    public Page<Turno> listarPaginado(String search, Pageable pageable) {

        // ❗ IMPORTANTE: tu entidad NO tiene "codigo"
        // así que este método de repo NO sirve:
        // findByNombreContainingIgnoreCaseOrCodigoContainingIgnoreCase()
        // Vamos a cambiarlo.

        if (search != null && !search.trim().isEmpty()) {
            return turnoRepository.findByNombreContainingIgnoreCase(
                    search.trim(),
                    pageable
            );
        }

        return turnoRepository.findAll(pageable);
    }

    @Override
    public Turno obtenerPorId(Long id) {
        return turnoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Turno no encontrado"));
    }

    @Override
    public Turno crear(Turno turno) {

        if (turnoRepository.existsByNombreIgnoreCase(turno.getNombre())) {
            throw new IllegalArgumentException("Ya existe un turno con ese nombre");
        }

        validarHorario(turno);

        turno.setActivo(true);
        return turnoRepository.save(turno);
    }

    @Override
    public Turno actualizar(Long id, Turno turno) {

        Turno actual = obtenerPorId(id);

        actual.setNombre(turno.getNombre());
        actual.setHoraInicio(turno.getHoraInicio());
        actual.setHoraFin(turno.getHoraFin());

        validarHorario(actual);

        return turnoRepository.save(actual);
    }

    @Override
    public void eliminar(Long id) {
        Turno turno = obtenerPorId(id);
        turnoRepository.delete(turno);
    }

    @Override
    public Turno cambiarEstado(Long id, boolean activo) {
        Turno turno = obtenerPorId(id);
        turno.setActivo(activo);
        return turnoRepository.save(turno);
    }

    @Override
    public List<Turno> listar() {
        return turnoRepository.findAll();
    }

    private void validarHorario(Turno turno) {

        if (turno.getHoraInicio() == null || turno.getHoraFin() == null) {
            throw new IllegalArgumentException("La hora de inicio y fin son obligatorias");
        }

        var inicio = turno.getHoraInicio();
        var fin = turno.getHoraFin();

        // ❌ Caso inválido: misma hora
        if (inicio.equals(fin)) {
            throw new IllegalArgumentException("La hora de salida debe ser posterior a la hora de entrada");
        }

        // ✔ Caso overnight permitido (ej: 22:00 → 06:00)
        if (fin.isBefore(inicio)) {
            return;
        }

        // ✔ Caso normal: fin > inicio
        if (fin.isAfter(inicio)) {
            return;
        }

        // ❌ Si no cumple
        throw new IllegalArgumentException("Horario inválido");
    }



}
