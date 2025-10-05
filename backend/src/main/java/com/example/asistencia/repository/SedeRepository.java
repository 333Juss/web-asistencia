package com.example.asistencia.repository;
import com.example.asistencia.entity.Sede;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SedeRepository extends JpaRepository<Sede, Long> {

    Optional<Sede> findByCodigo(String codigo);

    Boolean existsByCodigo(String codigo);

    List<Sede> findByActivo(Boolean activo);

    List<Sede> findByEmpresaId(Long empresaId);

    List<Sede> findByEmpresaIdAndActivo(Long empresaId, Boolean activo);

    @Query("SELECT s FROM Sede s WHERE s.empresa.id = :empresaId AND " +
            "(LOWER(s.nombre) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "s.codigo LIKE CONCAT('%', :search, '%') OR " +
            "LOWER(s.direccion) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Sede> searchSedesByEmpresa(@Param("empresaId") Long empresaId,
                                    @Param("search") String search,
                                    Pageable pageable);

    @Query("SELECT s FROM Sede s WHERE " +
            "LOWER(s.nombre) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "s.codigo LIKE CONCAT('%', :search, '%') OR " +
            "LOWER(s.direccion) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Sede> searchSedes(@Param("search") String search, Pageable pageable);

    @Query("SELECT COUNT(s) FROM Sede s WHERE s.activo = true")
    Long countActivas();
}