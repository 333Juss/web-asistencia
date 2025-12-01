package com.example.asistencia.repository;

import com.example.asistencia.entity.Asistencia;
import com.example.asistencia.entity.enums.EstadoAsistencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AsistenciaRepository extends JpaRepository<Asistencia, Long> {

        List<Asistencia> findByColaboradorIdAndFecha(Long colaboradorId, LocalDate fecha);

        List<Asistencia> findByColaboradorId(Long colaboradorId);

        List<Asistencia> findByColaboradorIdAndEstado(Long colaboradorId, EstadoAsistencia estado);

        List<Asistencia> findByColaboradorIdAndEstadoIn(Long colaboradorId, List<EstadoAsistencia> estados);

    @Query("SELECT a FROM Asistencia a WHERE a.colaborador.id = :colaboradorId ORDER BY a.fecha DESC")
        List<Asistencia> findByColaboradorIdOrderByFechaDesc(Long colaboradorId);

        @Query("SELECT a FROM Asistencia a WHERE a.colaborador.id = :colaboradorId AND a.fecha BETWEEN :startDate AND :endDate")
        org.springframework.data.domain.Page<Asistencia> findByColaboradorIdAndFechaBetween(
                        Long colaboradorId, LocalDate startDate, LocalDate endDate,
                        org.springframework.data.domain.Pageable pageable);

        @Query("SELECT a FROM Asistencia a WHERE a.colaborador.id = :colaboradorId AND a.fecha BETWEEN :startDate AND :endDate")
        List<Asistencia> findByColaboradorIdAndFechaBetweenList(Long colaboradorId, LocalDate startDate,
                        LocalDate endDate);

        long countByFechaAndEstado(LocalDate fecha, com.example.asistencia.entity.enums.EstadoAsistencia estado);

        long countByFechaAndEstadoIn(LocalDate fecha,
                        java.util.List<com.example.asistencia.entity.enums.EstadoAsistencia> estados);

        long countByColaboradorId(Long colaboradorId);
        long countByColaboradorIdAndEstado(Long colaboradorId, EstadoAsistencia estado);

    @Query("SELECT a.fecha, COUNT(a) FROM Asistencia a WHERE a.fecha BETWEEN :startDate AND :endDate AND a.estado IN :estados GROUP BY a.fecha ORDER BY a.fecha ASC")
        List<Object[]> countByFechaBetweenAndEstadoIn(LocalDate startDate, LocalDate endDate,
                        java.util.List<com.example.asistencia.entity.enums.EstadoAsistencia> estados);


    @Query("""
        SELECT a 
        FROM Asistencia a 
        WHERE a.colaborador.id = :id
        AND a.estado IN (
            com.example.asistencia.entity.enums.EstadoAsistencia.FALTA,
            com.example.asistencia.entity.enums.EstadoAsistencia.PENDIENTE_JUSTIFICACION,
            com.example.asistencia.entity.enums.EstadoAsistencia.JUSTIFICADA
        )
        ORDER BY a.fecha DESC
    """)
    List<Asistencia> findInasistencias(Long id);

}
