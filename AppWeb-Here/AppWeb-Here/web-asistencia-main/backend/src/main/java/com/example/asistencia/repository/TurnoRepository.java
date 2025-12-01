package com.example.asistencia.repository;

import com.example.asistencia.entity.Turno;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TurnoRepository extends JpaRepository<Turno, Long> {

    boolean existsByNombre(String nombre);
    boolean existsByNombreIgnoreCase(String nombre);

    Page<Turno> findByNombreContainingIgnoreCase(String nombre, Pageable pageable);
}
