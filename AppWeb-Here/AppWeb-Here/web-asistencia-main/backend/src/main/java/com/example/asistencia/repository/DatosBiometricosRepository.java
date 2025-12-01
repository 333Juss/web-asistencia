package com.example.asistencia.repository;

import com.example.asistencia.entity.DatosBiometricos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DatosBiometricosRepository extends JpaRepository<DatosBiometricos, Long> {

    List<DatosBiometricos> findByColaboradorIdAndActivoTrue(Long colaboradorId);

    @Query("SELECT COUNT(d) FROM DatosBiometricos d WHERE d.colaborador.id = :colaboradorId AND d.activo = true")
    long countByColaboradorIdAndActivoTrue(@Param("colaboradorId") Long colaboradorId);

    void deleteByColaboradorId(Long colaboradorId);
    boolean existsByColaboradorId(Long colaboradorId);

}
