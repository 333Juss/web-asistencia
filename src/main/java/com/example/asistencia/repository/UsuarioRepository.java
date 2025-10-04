package com.example.asistencia.repository;
import com.example.asistencia.entity.Usuario;
import com.example.asistencia.entity.enums.RolUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByUsername(String username);

    Boolean existsByUsername(String username);

    List<Usuario> findByRol(RolUsuario rol);

    List<Usuario> findByActivo(Boolean activo);

    Optional<Usuario> findByColaboradorId(Long colaboradorId);

    @Modifying
    @Query("UPDATE Usuario u SET u.intentosFallidos = :intentos WHERE u.id = :id")
    void updateIntentosFallidos(@Param("id") Long id, @Param("intentos") Integer intentos);

    @Modifying
    @Query("UPDATE Usuario u SET u.bloqueado = :bloqueado WHERE u.id = :id")
    void updateBloqueado(@Param("id") Long id, @Param("bloqueado") Boolean bloqueado);

    @Modifying
    @Query("UPDATE Usuario u SET u.ultimoAcceso = :fecha WHERE u.id = :id")
    void updateUltimoAcceso(@Param("id") Long id, @Param("fecha") LocalDateTime fecha);
}