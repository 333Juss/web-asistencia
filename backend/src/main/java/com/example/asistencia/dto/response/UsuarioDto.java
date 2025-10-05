package com.example.asistencia.dto.response;


import com.example.asistencia.entity.enums.RolUsuario;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioDto {
    private Long id;
    private Long colaboradorId;
    private String username;
    private RolUsuario rol;
    private LocalDateTime ultimoAcceso;
    private Integer intentosFallidos;
    private Boolean bloqueado;
    private Boolean activo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}