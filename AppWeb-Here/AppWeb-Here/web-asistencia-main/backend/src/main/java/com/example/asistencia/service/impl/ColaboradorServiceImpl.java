package com.example.asistencia.service.impl;

import com.example.asistencia.dto.request.ColaboradorCreateDto;
import com.example.asistencia.dto.request.ColaboradorUpdateDto;
import com.example.asistencia.dto.response.ColaboradorCreatedResponse;
import com.example.asistencia.entity.*;
import com.example.asistencia.exception.DuplicateResourceException;
import com.example.asistencia.exception.ResourceNotFoundException;
import com.example.asistencia.repository.ColaboradorRepository;
import com.example.asistencia.repository.EmpresaRepository;
import com.example.asistencia.repository.SedeRepository;
import com.example.asistencia.repository.UsuarioRepository;
import com.example.asistencia.repository.TurnoRepository;
import com.example.asistencia.service.ColaboradorService;
import com.example.asistencia.service.UsuarioService;
import com.example.asistencia.util.ValidationMessages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

import java.time.LocalDate;
import java.util.List;

@Service
public class ColaboradorServiceImpl implements ColaboradorService {

    @Autowired
    private ColaboradorRepository colaboradorRepository;

    @Autowired
    private EmpresaRepository empresaRepository;

    @Autowired
    private SedeRepository sedeRepository;
    @Autowired
    private UsuarioService usuarioService;
    @Autowired
    UsuarioRepository usuarioRepository;
    @Autowired
    private TurnoRepository turnoRepository;

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
    public ColaboradorCreatedResponse createColaboradorWithUser(ColaboradorCreateDto dto) {
        // Verificaciones existentes...
        Empresa empresa = empresaRepository.findById(dto.getEmpresaId())
                .orElseThrow(() -> new ResourceNotFoundException(ValidationMessages.EMPRESA_NOT_FOUND));

        if (colaboradorRepository.existsByDni(dto.getDni())) {
            throw new DuplicateResourceException(ValidationMessages.DUPLICATE_DNI);
        }

        if (colaboradorRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException(ValidationMessages.DUPLICATE_EMAIL);
        }

        Sede sede = null;
        if (dto.getSedeId() != null) {
            sede = sedeRepository.findById(dto.getSedeId())
                    .orElseThrow(() -> new ResourceNotFoundException(ValidationMessages.SEDE_NOT_FOUND));
        }

        // Crear colaborador
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

        colaborador = colaboradorRepository.save(colaborador);

        // Crear usuario si se solicita
        Usuario usuario = null;
        String username = null;
        String passwordTemporal = null;

        if (dto.getCrearUsuario() != null && dto.getCrearUsuario()) {
            // Validar que se proporcionaron credenciales
            if (dto.getUsername() == null || dto.getUsername().trim().isEmpty()) {
                throw new IllegalArgumentException("El username es obligatorio para crear el usuario");
            }
            if (dto.getPasswordTemporal() == null || dto.getPasswordTemporal().trim().isEmpty()) {
                throw new IllegalArgumentException("La contraseña temporal es obligatoria para crear el usuario");
            }

            // Verificar que el username no existe
            if (usuarioService.existsByUsername(dto.getUsername())) {
                throw new DuplicateResourceException("El username '" + dto.getUsername() + "' ya está en uso");
            }

            username = dto.getUsername();
            passwordTemporal = dto.getPasswordTemporal();
            usuario = usuarioService.createUsuarioForColaborador(colaborador, passwordTemporal);
            usuario.setUsername(username); // Asignar el username personalizado
            usuario = usuarioRepository.save(usuario);
        }

        return ColaboradorCreatedResponse.builder()
                .colaborador(colaborador)
                .usuarioCreado(usuario != null)
                .username(username)
                .passwordTemporal(passwordTemporal)
                .build();
    }

    @Override
    @Transactional
    public Colaborador createColaborador(ColaboradorCreateDto dto) {
        ColaboradorCreatedResponse response = createColaboradorWithUser(dto);
        return response.getColaborador();
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

    @Override
    public Colaborador asignarTurno(Long colaboradorId, Long turnoId) {
        Colaborador col = colaboradorRepository.findById(colaboradorId)
                .orElseThrow(() -> new IllegalArgumentException("Colaborador no encontrado"));

        Turno turno = turnoRepository.findById(turnoId)
                .orElseThrow(() -> new IllegalArgumentException("Turno no encontrado"));

        col.setTurno(turno);

        return colaboradorRepository.save(col);
    }


    @Override
    @Transactional(readOnly = true)
    public byte[] exportToExcel() {
        List<Colaborador> colaboradores = colaboradorRepository.findByActivo(true);

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Colaboradores");

            // Header
            String[] columns = { "ID", "DNI", "Nombres", "Apellidos", "Email", "Cargo", "Sede", "Estado" };
            Row headerRow = sheet.createRow(0);
            CellStyle headerCellStyle = workbook.createCellStyle();
            headerCellStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerCellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerCellStyle.setFont(headerFont);

            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerCellStyle);
            }

            // Data
            int rowIdx = 1;
            for (Colaborador col : colaboradores) {
                Row row = sheet.createRow(rowIdx++);

                row.createCell(0).setCellValue(col.getId());
                row.createCell(1).setCellValue(col.getDni());
                row.createCell(2).setCellValue(col.getNombres());
                row.createCell(3).setCellValue(col.getApellidos());
                row.createCell(4).setCellValue(col.getEmail());
                row.createCell(5).setCellValue(col.getCargo() != null ? col.getCargo() : "");
                row.createCell(6).setCellValue(col.getSede() != null ? col.getSede().getNombre() : "");
                row.createCell(7).setCellValue(col.getActivo() ? "Activo" : "Inactivo");
            }

            // Resize columns
            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("Error al generar el archivo Excel", e);
        }
    }

    @Override
    @Transactional
    public Colaborador asignarTurnoConFecha(Long colaboradorId, Long turnoId, String fechaInicio) {

        Colaborador col = colaboradorRepository.findById(colaboradorId)
                .orElseThrow(() -> new IllegalArgumentException("Colaborador no encontrado"));

        Turno turno = turnoRepository.findById(turnoId)
                .orElseThrow(() -> new IllegalArgumentException("Turno no encontrado"));

        col.setTurno(turno);

        if (fechaInicio != null) {
            col.setFechaInicioTurno(LocalDate.parse(fechaInicio));
        }

        return colaboradorRepository.save(col);
    }

    @Transactional
    @Override
    public void asignarTurnoMasivo(List<Long> colaboradorIds, Long turnoId, LocalDate fechaInicioTurno) {

        Turno turno = turnoRepository.findById(turnoId)
                .orElseThrow(() -> new RuntimeException("Turno no encontrado"));

        List<Colaborador> colaboradores = colaboradorRepository.findAllById(colaboradorIds);

        for (Colaborador c : colaboradores) {
            c.setTurno(turno);
            c.setFechaInicioTurno(fechaInicioTurno);
        }

        colaboradorRepository.saveAll(colaboradores);
    }
}