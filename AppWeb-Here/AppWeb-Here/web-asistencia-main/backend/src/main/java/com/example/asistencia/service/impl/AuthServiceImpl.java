package com.example.asistencia.service.impl;
import com.example.asistencia.dto.request.LoginRequestDto;
import com.example.asistencia.dto.response.LoginResponseDto;
import com.example.asistencia.entity.Usuario;
import com.example.asistencia.exception.UnauthorizedException;
import com.example.asistencia.repository.UsuarioRepository;
import com.example.asistencia.security.jwt.JwtTokenProvider;
import com.example.asistencia.service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class AuthServiceImpl implements AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);
    private static final int MAX_FAILED_ATTEMPTS = 5;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    @Transactional
    public LoginResponseDto login(LoginRequestDto loginRequest) {
        try {
            // Verificar si el usuario existe y no está bloqueado
            Usuario usuario = usuarioRepository.findByUsername(loginRequest.getUsername())
                    .orElseThrow(() -> new UnauthorizedException("Credenciales inválidas"));

            if (!usuario.getActivo()) {
                throw new UnauthorizedException("Usuario inactivo");
            }

            if (usuario.getBloqueado()) {
                throw new UnauthorizedException("Usuario bloqueado. Contacte al administrador");
            }

            // Autenticar
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Generar token
            String token = tokenProvider.generateToken(authentication);

            // Resetear intentos fallidos y actualizar último acceso
            resetFailedLoginAttempts(loginRequest.getUsername());
            updateLastAccess(loginRequest.getUsername());

            // Construir respuesta
            return LoginResponseDto.fromUsuario(usuario, token);

        } catch (BadCredentialsException e) {
            // Registrar intento fallido
            registerFailedLoginAttempt(loginRequest.getUsername());
            throw new UnauthorizedException("Credenciales inválidas");
        } catch (AuthenticationException e) {
            logger.error("Error de autenticación: {}", e.getMessage());
            throw new UnauthorizedException("Error de autenticación");
        }
    }

    @Override
    @Transactional
    public void registerFailedLoginAttempt(String username) {
        usuarioRepository.findByUsername(username).ifPresent(usuario -> {
            int newFailedAttempts = usuario.getIntentosFallidos() + 1;
            usuarioRepository.updateIntentosFallidos(usuario.getId(), newFailedAttempts);

            if (newFailedAttempts >= MAX_FAILED_ATTEMPTS) {
                lockUser(username);
                logger.warn("Usuario bloqueado por múltiples intentos fallidos: {}", username);
            }
        });
    }

    @Override
    @Transactional
    public void resetFailedLoginAttempts(String username) {
        usuarioRepository.findByUsername(username).ifPresent(usuario -> {
            usuarioRepository.updateIntentosFallidos(usuario.getId(), 0);
        });
    }

    @Override
    @Transactional
    public void lockUser(String username) {
        usuarioRepository.findByUsername(username).ifPresent(usuario -> {
            usuarioRepository.updateBloqueado(usuario.getId(), true);
        });
    }

    @Override
    @Transactional
    public void updateLastAccess(String username) {
        usuarioRepository.findByUsername(username).ifPresent(usuario -> {
            usuarioRepository.updateUltimoAcceso(usuario.getId(), LocalDateTime.now());
        });
    }
}
