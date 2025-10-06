package com.example.asistencia.service;
import com.example.asistencia.dto.request.ColaboradorCreateDto;
import com.example.asistencia.dto.request.ColaboradorUpdateDto;
import com.example.asistencia.dto.response.ColaboradorCreatedResponse;
import com.example.asistencia.entity.Colaborador;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ColaboradorService {

    Page<Colaborador> getAllColaboradores(Pageable pageable);

    Page<Colaborador> searchColaboradores(String search, Pageable pageable);

    List<Colaborador> getColaboradoresActivos();

    List<Colaborador> getColaboradoresByEmpresa(Long empresaId);

    List<Colaborador> getColaboradoresBySede(Long sedeId);

    Colaborador getColaboradorById(Long id);

    Colaborador getColaboradorByDni(String dni);

    Colaborador getColaboradorByEmail(String email);

    Colaborador createColaborador(ColaboradorCreateDto dto);

    Colaborador updateColaborador(Long id, ColaboradorUpdateDto dto);

    void deleteColaborador(Long id);

    Colaborador toggleStatus(Long id, Boolean activo);

    Boolean existsByDni(String dni);

    Boolean existsByEmail(String email);

    Boolean checkDniExists(String dni, Long excludeId);

    Boolean checkEmailExists(String email, Long excludeId);

    Long countActivos();

    Long countConDatosBiometricos();
    ColaboradorCreatedResponse createColaboradorWithUser(ColaboradorCreateDto dto);
}