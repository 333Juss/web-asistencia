package com.example.asistencia.repository;

import com.example.asistencia.dto.JustificacionAdminDTO;
import com.example.asistencia.entity.Justificacion;
import com.example.asistencia.entity.enums.EstadoJustificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface JustificacionRepository extends JpaRepository<Justificacion, Long> {

    boolean existsByAsistenciaId(Long asistenciaId);

    Optional<Justificacion> findByAsistenciaId(Long asistenciaId);

    List<Justificacion> findByColaboradorId(Long colaboradorId);

    List<Justificacion> findByEstado(EstadoJustificacion estado);
}


