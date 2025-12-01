package com.example.asistencia.repository;

import com.example.asistencia.entity.Configuracion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConfiguracionRepository extends JpaRepository<Configuracion, Long> {
    // Singleton pattern: we usually just fetch the first one or by ID 1
}
