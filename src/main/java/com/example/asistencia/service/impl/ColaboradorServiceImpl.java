package com.example.asistencia.service.impl;

import com.example.asistencia.dto.request.ColaboradorCreateDto;
import com.example.asistencia.dto.request.ColaboradorUpdateDto;
import com.example.asistencia.entity.Colaborador;
import com.example.asistencia.entity.Empresa;
import com.example.asistencia.entity.Sede;
import com.example.asistencia.exception.DuplicateResourceException;
import com.example.asistencia.exception.ResourceNotFoundException;
import com.example.asistencia.repository.ColaboradorRepository;
import com.example.asistencia.repository.EmpresaRepository;
import com.example.asistencia.repository.SedeRepository;
import com.example.asistencia.service.ColaboradorService;
import com.example.asistencia.util.ValidationMessages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ColaboradorServiceImpl implements ColaboradorService {

    @Autowired
    private ColaboradorRepository colaboradorRepository;

    @Autowired
    private EmpresaRepository empresaRepository;

    @Autowired
    private SedeRepository sedeRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<Colaborador> getAllColaboradores(Pageable pageable) {
        return colaboradorRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Colaborador> searchColaboradores(String search, Pageable pageable) {
        if (search == null || search.trim().isEmpty()) {
            return colaboradorRepository.findAll(pageable);
        }
        return colaboradorRepository.searchColaboradores(search.trim(), pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Colaborador> getColaboradoresActivos() {
        return colaboradorRepository.findByActivo(true);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Colaborador> getColaboradoresByEmpresa(Long empresaId) {
        return colaboradorRepository.findByEmpresaId(empresaId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Colaborador> getColaboradoresBySede(Long sedeId) {
        return colaboradorRepository.findBySedeId(sedeId);
    }

    @Override
    @Transactional(readOnly = true)
    public Colaborador getColaboradorById(Long id) {
        return colaboradorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ValidationMessages.COLABORADOR_NOT_FOUND));
    }

    @Override
    @Transactional(readOnly = true)
    public Colaborador getColaboradorByDni(String dni) {
        return colaboradorRepository.findByDni(dni)
                .orElseThrow(() -> new ResourceNotFoundException("Colaborador con DNI " + dni + " no encontrado"));
    }

    @Override
    @Transactional(readOnly = true)
    public Colaborador getColaboradorByEmail(String email) {
        return colaboradorRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Colaborador con email " + email + " no encontrado"));
    }

    @Override
    @Transactional
    public Colaborador createColaborador(ColaboradorCreateDto dto) {
        // Verificar que la empresa existe
        Empresa empresa = empresaRepository.findById(dto.getEmpresaId())
                .orElseThrow(() -> new ResourceNotFoundException(ValidationMessages.EMPRESA_NOT_FOUND));

        // Verificar que el DNI no existe
        if (colaboradorRepository.existsByDni(dto.getDni())) {
            throw new DuplicateResourceException(ValidationMessages.DUPLICATE_DNI);
        }

        // Verificar que el email no existe
        if (colaboradorRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException(ValidationMessages.DUPLICATE_EMAIL);
        }

        // Verificar sede si se proporciona
        Sede sede = null;
        if (dto.getSedeId() != null) {
            sede = sedeRepository.findById(dto.getSedeId())
                    .orElseThrow(() -> new ResourceNotFoundException(ValidationMessages.SEDE_NOT_FOUND));
        }

        Colaborador colaborador = Colaborador.builder()
                .empresa(empresa)
                .sede(sede)
                .dni(dto.getDni())
                .nombres(dto.getNombres())
                .apellidos(dto.getApellidos())
                .email(dto.getEmail())
                .telefono(dto.getTelefono())
                .fechaNacimiento(dto.getFechaNacimiento())
                .fechaIngreso(dto.getFechaIngreso())
                .cargo(dto.getCargo())
                .tieneDatosBiometricos(false)
                .activo(true)
                .build();

        return colaboradorRepository.save(colaborador);
    }

    @Override
    @Transactional
    public Colaborador updateColaborador(Long id, ColaboradorUpdateDto dto) {
        Colaborador colaborador = getColaboradorById(id);

        // Verificar email si se está actualizando
        if (dto.getEmail() != null && !dto.getEmail().equals(colaborador.getEmail())) {
            if (colaboradorRepository.existsByEmail(dto.getEmail())) {
                throw new DuplicateResourceException(ValidationMessages.DUPLICATE_EMAIL);
            }
            colaborador.setEmail(dto.getEmail());
        }

        // Actualizar sede si se proporciona
        if (dto.getSedeId() != null) {
            Sede sede = sedeRepository.findById(dto.getSedeId())
                    .orElseThrow(() -> new ResourceNotFoundException(ValidationMessages.SEDE_NOT_FOUND));
            colaborador.setSede(sede);
        }

        if (dto.getNombres() != null) {
            colaborador.setNombres(dto.getNombres());
        }
        if (dto.getApellidos() != null) {
            colaborador.setApellidos(dto.getApellidos());
        }
        if (dto.getTelefono() != null) {
            colaborador.setTelefono(dto.getTelefono());
        }
        if (dto.getFechaNacimiento() != null) {
            colaborador.setFechaNacimiento(dto.getFechaNacimiento());
        }
        if (dto.getFechaIngreso() != null) {
            colaborador.setFechaIngreso(dto.getFechaIngreso());
        }
        if (dto.getCargo() != null) {
            colaborador.setCargo(dto.getCargo());
        }
        if (dto.getActivo() != null) {
            colaborador.setActivo(dto.getActivo());
        }

        return colaboradorRepository.save(colaborador);
    }

    @Override
    @Transactional
    public void deleteColaborador(Long id) {
        Colaborador colaborador = getColaboradorById(id);
        colaborador.setActivo(false);
        colaboradorRepository.save(colaborador);
    }

    @Override
    @Transactional
    public Colaborador toggleStatus(Long id, Boolean activo) {
        Colaborador colaborador = getColaboradorById(id);
        colaborador.setActivo(activo);
        return colaboradorRepository.save(colaborador);
    }

    @Override
    @Transactional(readOnly = true)
    public Boolean existsByDni(String dni) {
        return colaboradorRepository.existsByDni(dni);
    }

    @Override
    @Transactional(readOnly = true)
    public Boolean existsByEmail(String email) {
        return colaboradorRepository.existsByEmail(email);
    }

    @Override
    @Transactional(readOnly = true)
    public Boolean checkDniExists(String dni, Long excludeId) {
        if (excludeId != null) {
            Colaborador colaborador = colaboradorRepository.findByDni(dni).orElse(null);
            return colaborador != null && !colaborador.getId().equals(excludeId);
        }
        return colaboradorRepository.existsByDni(dni);
    }

    @Override
    @Transactional(readOnly = true)
    public Boolean checkEmailExists(String email, Long excludeId) {
        if (excludeId != null) {
            Colaborador colaborador = colaboradorRepository.findByEmail(email).orElse(null);
            return colaborador != null && !colaborador.getId().equals(excludeId);
        }
        return colaboradorRepository.existsByEmail(email);
    }

    @Override
    @Transactional(readOnly = true)
    public Long countActivos() {
        return colaboradorRepository.countActivos();
    }

    @Override
    @Transactional(readOnly = true)
    public Long countConDatosBiometricos() {
        return colaboradorRepository.countConDatosBiometricos();
    }
}