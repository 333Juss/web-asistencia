package com.example.asistencia.repository;
import com.example.asistencia.entity.Colaborador;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ColaboradorRepository extends JpaRepository<Colaborador, Long> {

    Optional<Colaborador> findByDni(String dni);

    Optional<Colaborador> findByEmail(String email);

    Boolean existsByDni(String dni);

    Boolean existsByEmail(String email);

    List<Colaborador> findByActivo(Boolean activo);

    List<Colaborador> findByEmpresaId(Long empresaId);

    List<Colaborador> findBySedeId(Long sedeId);

    List<Colaborador> findByEmpresaIdAndActivo(Long empresaId, Boolean activo);

    List<Colaborador> findBySedeIdAndActivo(Long sedeId, Boolean activo);

    @Query("SELECT c FROM Colaborador c WHERE c.empresa.id = :empresaId AND " +
            "(LOWER(c.nombres) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(c.apellidos) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "c.dni LIKE CONCAT('%', :search, '%') OR " +
            "LOWER(c.email) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Colaborador> searchColaboradoresByEmpresa(@Param("empresaId") Long empresaId,
                                                   @Param("search") String search,
                                                   Pageable pageable);

    @Query("SELECT c FROM Colaborador c WHERE " +
            "LOWER(c.nombres) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(c.apellidos) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "c.dni LIKE CONCAT('%', :search, '%') OR " +
            "LOWER(c.email) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Colaborador> searchColaboradores(@Param("search") String search, Pageable pageable);

    @Query("SELECT COUNT(c) FROM Colaborador c WHERE c.activo = true")
    Long countActivos();

    @Query("SELECT COUNT(c) FROM Colaborador c WHERE c.tieneDatosBiometricos = true")
    Long countConDatosBiometricos();
}