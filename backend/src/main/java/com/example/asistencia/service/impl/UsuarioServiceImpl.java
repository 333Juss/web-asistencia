package com.example.asistencia.service.impl;

import com.example.asistencia.entity.Colaborador;
import com.example.asistencia.entity.Usuario;
import com.example.asistencia.entity.enums.RolUsuario;
import com.example.asistencia.repository.UsuarioRepository;
import com.example.asistencia.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final String CARACTERES = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$";
    private static final int PASSWORD_LENGTH = 10;

    @Override
    @Transactional
    public Usuario createUsuarioForColaborador(Colaborador colaborador, String passwordTemporal) {
        // Ya no genera username automático
        Usuario usuario = Usuario.builder()
                .colaborador(colaborador)
                .username("") // Se asignará después
                .password(passwordEncoder.encode(passwordTemporal))
                .rol(RolUsuario.EMPLEADO)
                .activo(true)
                .bloqueado(false)
                .intentosFallidos(0)
                .build();

        return usuario; // No lo guarda aún
    }
    @Override
    public String generateTemporaryPassword() {
        SecureRandom random = new SecureRandom();
        StringBuilder password = new StringBuilder(PASSWORD_LENGTH);

        for (int i = 0; i < PASSWORD_LENGTH; i++) {
            password.append(CARACTERES.charAt(random.nextInt(CARACTERES.length())));
        }

        return password.toString();
    }

    @Override
    public Usuario findByUsername(String username) {
        return usuarioRepository.findByUsername(username).orElse(null);
    }

    @Override
    public boolean existsByUsername(String username) {
        return usuarioRepository.existsByUsername(username);
    }

    /**
     * Genera un username único basado en el DNI
     */
    private String generateUniqueUsername(String dni) {
        String baseUsername = dni;
        String username = baseUsername;
        int counter = 1;

        while (usuarioRepository.existsByUsername(username)) {
            username = baseUsername + counter;
            counter++;
        }

        return username;
    }
}