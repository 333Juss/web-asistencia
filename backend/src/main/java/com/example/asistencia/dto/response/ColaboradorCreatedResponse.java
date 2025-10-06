package com.example.asistencia.dto.response;

import com.example.asistencia.entity.Colaborador;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ColaboradorCreatedResponse {
    private Colaborador colaborador;
    private Boolean usuarioCreado;
    private String username;
    private String passwordTemporal; // Solo se envía una vez
    private String mensaje;
}