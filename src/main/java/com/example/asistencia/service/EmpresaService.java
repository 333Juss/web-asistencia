package com.example.asistencia.service;
import com.example.asistencia.dto.request.EmpresaCreateDto;
import com.example.asistencia.dto.request.EmpresaUpdateDto;
import com.example.asistencia.entity.Empresa;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface EmpresaService {

    Page<Empresa> getAllEmpresas(Pageable pageable);

    Page<Empresa> searchEmpresas(String search, Pageable pageable);

    List<Empresa> getEmpresasActivas();

    Empresa getEmpresaById(Long id);

    Empresa getEmpresaByRuc(String ruc);

    Empresa createEmpresa(EmpresaCreateDto dto);

    Empresa updateEmpresa(Long id, EmpresaUpdateDto dto);

    void deleteEmpresa(Long id);

    Empresa toggleStatus(Long id, Boolean activo);

    Boolean existsByRuc(String ruc);

    Long countActivas();
}
