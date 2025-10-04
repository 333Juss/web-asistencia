package com.example.asistencia.service;
import com.example.asistencia.dto.request.SedeCreateDto;
import com.example.asistencia.dto.request.SedeUpdateDto;
import com.example.asistencia.entity.Sede;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface SedeService {

    Page<Sede> getAllSedes(Pageable pageable);

    Page<Sede> searchSedes(String search, Pageable pageable);

    List<Sede> getSedesActivas();

    List<Sede> getSedesByEmpresa(Long empresaId);

    List<Sede> getSedesActivasByEmpresa(Long empresaId);

    Sede getSedeById(Long id);

    Sede getSedeByCodigo(String codigo);

    Sede createSede(SedeCreateDto dto);

    Sede updateSede(Long id, SedeUpdateDto dto);

    void deleteSede(Long id);

    Sede toggleStatus(Long id, Boolean activo);

    Boolean existsByCodigo(String codigo);

    Long countActivas();

    boolean validarUbicacion(double latitud, double longitud, Long sedeId);
}