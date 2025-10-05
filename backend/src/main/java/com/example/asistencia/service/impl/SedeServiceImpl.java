package com.example.asistencia.service.impl;
import com.example.asistencia.dto.request.SedeCreateDto;
import com.example.asistencia.dto.request.SedeUpdateDto;
import com.example.asistencia.entity.Empresa;
import com.example.asistencia.entity.Sede;
import com.example.asistencia.exception.BadRequestException;
import com.example.asistencia.exception.DuplicateResourceException;
import com.example.asistencia.exception.ResourceNotFoundException;
import com.example.asistencia.repository.EmpresaRepository;
import com.example.asistencia.repository.SedeRepository;
import com.example.asistencia.service.GeolocalizacionService;
import com.example.asistencia.service.SedeService;
import com.example.asistencia.util.ValidationMessages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SedeServiceImpl implements SedeService {

    @Autowired
    private SedeRepository sedeRepository;

    @Autowired
    private EmpresaRepository empresaRepository;

    @Autowired
    private GeolocalizacionService geolocalizacionService;

    @Override
    @Transactional(readOnly = true)
    public Page<Sede> getAllSedes(Pageable pageable) {
        return sedeRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Sede> searchSedes(String search, Pageable pageable) {
        if (search == null || search.trim().isEmpty()) {
            return sedeRepository.findAll(pageable);
        }
        return sedeRepository.searchSedes(search.trim(), pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Sede> getSedesActivas() {
        return sedeRepository.findByActivo(true);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Sede> getSedesByEmpresa(Long empresaId) {
        return sedeRepository.findByEmpresaId(empresaId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Sede> getSedesActivasByEmpresa(Long empresaId) {
        return sedeRepository.findByEmpresaIdAndActivo(empresaId, true);
    }

    @Override
    @Transactional(readOnly = true)
    public Sede getSedeById(Long id) {
        return sedeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ValidationMessages.SEDE_NOT_FOUND));
    }

    @Override
    @Transactional(readOnly = true)
    public Sede getSedeByCodigo(String codigo) {
        return sedeRepository.findByCodigo(codigo)
                .orElseThrow(() -> new ResourceNotFoundException("Sede con código " + codigo + " no encontrada"));
    }

    @Override
    @Transactional
    public Sede createSede(SedeCreateDto dto) {
        // Verificar que la empresa existe
        Empresa empresa = empresaRepository.findById(dto.getEmpresaId())
                .orElseThrow(() -> new ResourceNotFoundException(ValidationMessages.EMPRESA_NOT_FOUND));

        // Verificar que el código no existe
        if (sedeRepository.existsByCodigo(dto.getCodigo())) {
            throw new DuplicateResourceException("El código de sede ya existe");
        }

        // Validar coordenadas si están presentes
        if (dto.getLatitud() != null && dto.getLongitud() != null) {
            if (!geolocalizacionService.validarCoordenadas(dto.getLatitud(), dto.getLongitud())) {
                throw new BadRequestException(ValidationMessages.COORDINATES_REQUIRED);
            }
        }

        // Validar radio
        if (!geolocalizacionService.validarRadio(dto.getRadioMetros())) {
            throw new BadRequestException(ValidationMessages.RADIUS_OUT_OF_RANGE);
        }

        Sede sede = Sede.builder()
                .empresa(empresa)
                .codigo(dto.getCodigo())
                .nombre(dto.getNombre())
                .direccion(dto.getDireccion())
                .distrito(dto.getDistrito())
                .provincia(dto.getProvincia())
                .departamento(dto.getDepartamento())
                .latitud(dto.getLatitud())
                .longitud(dto.getLongitud())
                .radioMetros(dto.getRadioMetros())
                .activo(true)
                .build();

        return sedeRepository.save(sede);
    }

    @Override
    @Transactional
    public Sede updateSede(Long id, SedeUpdateDto dto) {
        Sede sede = getSedeById(id);

        if (dto.getNombre() != null) {
            sede.setNombre(dto.getNombre());
        }
        if (dto.getDireccion() != null) {
            sede.setDireccion(dto.getDireccion());
        }
        if (dto.getDistrito() != null) {
            sede.setDistrito(dto.getDistrito());
        }
        if (dto.getProvincia() != null) {
            sede.setProvincia(dto.getProvincia());
        }
        if (dto.getDepartamento() != null) {
            sede.setDepartamento(dto.getDepartamento());
        }
        if (dto.getLatitud() != null && dto.getLongitud() != null) {
            if (!geolocalizacionService.validarCoordenadas(dto.getLatitud(), dto.getLongitud())) {
                throw new BadRequestException(ValidationMessages.COORDINATES_REQUIRED);
            }
            sede.setLatitud(dto.getLatitud());
            sede.setLongitud(dto.getLongitud());
        }
        if (dto.getRadioMetros() != null) {
            if (!geolocalizacionService.validarRadio(dto.getRadioMetros())) {
                throw new BadRequestException(ValidationMessages.RADIUS_OUT_OF_RANGE);
            }
            sede.setRadioMetros(dto.getRadioMetros());
        }
        if (dto.getActivo() != null) {
            sede.setActivo(dto.getActivo());
        }

        return sedeRepository.save(sede);
    }

    @Override
    @Transactional
    public void deleteSede(Long id) {
        Sede sede = getSedeById(id);
        sede.setActivo(false);
        sedeRepository.save(sede);
    }

    @Override
    @Transactional
    public Sede toggleStatus(Long id, Boolean activo) {
        Sede sede = getSedeById(id);
        sede.setActivo(activo);
        return sedeRepository.save(sede);
    }

    @Override
    @Transactional(readOnly = true)
    public Boolean existsByCodigo(String codigo) {
        return sedeRepository.existsByCodigo(codigo);
    }

    @Override
    @Transactional(readOnly = true)
    public Long countActivas() {
        return sedeRepository.countActivas();
    }

    @Override
    @Transactional(readOnly = true)
    public boolean validarUbicacion(double latitud, double longitud, Long sedeId) {
        Sede sede = getSedeById(sedeId);
        return geolocalizacionService.estaDentroDelRadio(latitud, longitud, sede);
    }
}