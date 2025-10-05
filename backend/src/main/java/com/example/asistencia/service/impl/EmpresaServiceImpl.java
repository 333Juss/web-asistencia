package com.example.asistencia.service.impl;
import com.example.asistencia.dto.request.EmpresaCreateDto;
import com.example.asistencia.dto.request.EmpresaUpdateDto;
import com.example.asistencia.entity.Empresa;
import com.example.asistencia.exception.DuplicateResourceException;
import com.example.asistencia.exception.ResourceNotFoundException;
import com.example.asistencia.repository.EmpresaRepository;
import com.example.asistencia.service.EmpresaService;
import com.example.asistencia.util.ValidationMessages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EmpresaServiceImpl implements EmpresaService {

    @Autowired
    private EmpresaRepository empresaRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<Empresa> getAllEmpresas(Pageable pageable) {
        return empresaRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Empresa> searchEmpresas(String search, Pageable pageable) {
        if (search == null || search.trim().isEmpty()) {
            return empresaRepository.findAll(pageable);
        }
        return empresaRepository.searchEmpresas(search.trim(), pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Empresa> getEmpresasActivas() {
        return empresaRepository.findByActivo(true);
    }

    @Override
    @Transactional(readOnly = true)
    public Empresa getEmpresaById(Long id) {
        return empresaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ValidationMessages.EMPRESA_NOT_FOUND));
    }

    @Override
    @Transactional(readOnly = true)
    public Empresa getEmpresaByRuc(String ruc) {
        return empresaRepository.findByRuc(ruc)
                .orElseThrow(() -> new ResourceNotFoundException("Empresa con RUC " + ruc + " no encontrada"));
    }

    @Override
    @Transactional
    public Empresa createEmpresa(EmpresaCreateDto dto) {
        if (empresaRepository.existsByRuc(dto.getRuc())) {
            throw new DuplicateResourceException(ValidationMessages.DUPLICATE_RUC);
        }

        Empresa empresa = Empresa.builder()
                .ruc(dto.getRuc())
                .razonSocial(dto.getRazonSocial())
                .nombreComercial(dto.getNombreComercial())
                .direccion(dto.getDireccion())
                .ciudad(dto.getCiudad())
                .departamento(dto.getDepartamento())
                .codigoPostal(dto.getCodigoPostal())
                .telefono(dto.getTelefono())
                .categoria(dto.getCategoria())
                .descripcion(dto.getDescripcion())
                .cantidadEmpleados(dto.getCantidadEmpleados())
                .activo(true)
                .build();

        return empresaRepository.save(empresa);
    }

    @Override
    @Transactional
    public Empresa updateEmpresa(Long id, EmpresaUpdateDto dto) {
        Empresa empresa = getEmpresaById(id);

        if (dto.getRazonSocial() != null) {
            empresa.setRazonSocial(dto.getRazonSocial());
        }
        if (dto.getNombreComercial() != null) {
            empresa.setNombreComercial(dto.getNombreComercial());
        }
        if (dto.getDireccion() != null) {
            empresa.setDireccion(dto.getDireccion());
        }
        if (dto.getCiudad() != null) {
            empresa.setCiudad(dto.getCiudad());
        }
        if (dto.getDepartamento() != null) {
            empresa.setDepartamento(dto.getDepartamento());
        }
        if (dto.getCodigoPostal() != null) {
            empresa.setCodigoPostal(dto.getCodigoPostal());
        }
        if (dto.getTelefono() != null) {
            empresa.setTelefono(dto.getTelefono());
        }
        if (dto.getCategoria() != null) {
            empresa.setCategoria(dto.getCategoria());
        }
        if (dto.getDescripcion() != null) {
            empresa.setDescripcion(dto.getDescripcion());
        }
        if (dto.getCantidadEmpleados() != null) {
            empresa.setCantidadEmpleados(dto.getCantidadEmpleados());
        }
        if (dto.getActivo() != null) {
            empresa.setActivo(dto.getActivo());
        }

        return empresaRepository.save(empresa);
    }

    @Override
    @Transactional
    public void deleteEmpresa(Long id) {
        Empresa empresa = getEmpresaById(id);
        empresa.setActivo(false);
        empresaRepository.save(empresa);
    }

    @Override
    @Transactional
    public Empresa toggleStatus(Long id, Boolean activo) {
        Empresa empresa = getEmpresaById(id);
        empresa.setActivo(activo);
        return empresaRepository.save(empresa);
    }

    @Override
    @Transactional(readOnly = true)
    public Boolean existsByRuc(String ruc) {
        return empresaRepository.existsByRuc(ruc);
    }

    @Override
    @Transactional(readOnly = true)
    public Long countActivas() {
        return empresaRepository.countActivas();
    }
}