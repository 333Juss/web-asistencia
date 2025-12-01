package com.example.asistencia.service;

import com.example.asistencia.entity.Turno;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface TurnoService {
    Page<Turno> listarPaginado(String search, Pageable pageable);

    Turno obtenerPorId(Long id);

    Turno crear(Turno turno);

    Turno actualizar(Long id, Turno turno);

    void eliminar(Long id);

    Turno cambiarEstado(Long id, boolean activo);

    List<Turno> listar();
}
