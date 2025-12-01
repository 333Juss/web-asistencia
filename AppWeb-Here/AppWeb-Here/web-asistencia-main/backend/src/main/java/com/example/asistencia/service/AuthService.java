package com.example.asistencia.service;

import com.example.asistencia.dto.request.LoginRequestDto;
import com.example.asistencia.dto.response.LoginResponseDto;

public interface AuthService {

    /**
     * Autentica un usuario y genera un token JWT
     */
    LoginResponseDto login(LoginRequestDto loginRequest);

    /**
     * Registra un intento fallido de login
     */
    void registerFailedLoginAttempt(String username);

    /**
     * Resetea los intentos fallidos de login
     */
    void resetFailedLoginAttempts(String username);

    /**
     * Bloquea un usuario
     */
    void lockUser(String username);

    /**
     * Actualiza la fecha de último acceso
     */
    void updateLastAccess(String username);
}