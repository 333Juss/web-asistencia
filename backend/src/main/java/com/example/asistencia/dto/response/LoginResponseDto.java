package com.example.asistencia.dto.response;

import com.example.asistencia.entity.Colaborador;
import com.example.asistencia.entity.Usuario;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponseDto {

    private String token;
    private UsuarioDto usuario;
    private ColaboradorDto colaborador;

    @Builder.Default
    private Long expiresIn = 86400000L;

    public static LoginResponseDto fromUsuario(Usuario usuario, String token) {
        // Construir DTO del usuario
        UsuarioDto usuarioDto = UsuarioDto.builder()
                .id(usuario.getId())
                .colaboradorId(usuario.getColaborador() != null ? usuario.getColaborador().getId() : null)
                .username(usuario.getUsername())
                .rol(usuario.getRol())
                .ultimoAcceso(usuario.getUltimoAcceso())
                .intentosFallidos(usuario.getIntentosFallidos())
                .bloqueado(usuario.getBloqueado())
                .activo(usuario.getActivo())
                .createdAt(usuario.getCreatedAt())
                .updatedAt(usuario.getUpdatedAt())
                .build();

        // Construir DTO del colaborador si existe
        ColaboradorDto colaboradorDto = null;
        if (usuario.getColaborador() != null) {
            Colaborador colab = usuario.getColaborador();
            colaboradorDto = ColaboradorDto.builder()
                    .id(colab.getId())
                    .empresaId(colab.getEmpresa() != null ? colab.getEmpresa().getId() : null)
                    .sedeId(colab.getSede() != null ? colab.getSede().getId() : null)
                    .dni(colab.getDni())
                    .nombres(colab.getNombres())
                    .apellidos(colab.getApellidos())
                    .nombreCompleto(colab.getNombreCompleto())
                    .email(colab.getEmail())
                    .telefono(colab.getTelefono())
                    .fechaNacimiento(colab.getFechaNacimiento())
                    .fechaIngreso(colab.getFechaIngreso())
                    .cargo(colab.getCargo())
                    .tieneDatosBiometricos(colab.getTieneDatosBiometricos())
                    .activo(colab.getActivo())
                    .createdAt(colab.getCreatedAt())
                    .updatedAt(colab.getUpdatedAt())
                    .build();
        }

        return LoginResponseDto.builder()
                .token(token)
                .usuario(usuarioDto)
                .colaborador(colaboradorDto)
                .build();
    }
}