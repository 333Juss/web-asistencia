package com.example.asistencia.service;

import com.example.asistencia.entity.Colaborador;
import com.example.asistencia.entity.Usuario;
import com.example.asistencia.entity.enums.RolUsuario;

public interface UsuarioService {
    Usuario createUsuarioForColaborador(Colaborador colaborador, String passwordTemporal);
    String generateTemporaryPassword();
    Usuario findByUsername(String username);
    boolean existsByUsername(String username);
}