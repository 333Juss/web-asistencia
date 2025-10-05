package com.example.asistencia.repository;
import com.example.asistencia.entity.Empresa;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmpresaRepository extends JpaRepository<Empresa, Long> {

    Optional<Empresa> findByRuc(String ruc);

    Boolean existsByRuc(String ruc);

    List<Empresa> findByActivo(Boolean activo);

    @Query("SELECT e FROM Empresa e WHERE " +
            "LOWER(e.razonSocial) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(e.nombreComercial) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "e.ruc LIKE CONCAT('%', :search, '%')")
    Page<Empresa> searchEmpresas(@Param("search") String search, Pageable pageable);

    @Query("SELECT COUNT(e) FROM Empresa e WHERE e.activo = true")
    Long countActivas();
}