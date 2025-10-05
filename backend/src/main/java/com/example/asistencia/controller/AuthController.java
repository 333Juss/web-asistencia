package com.example.asistencia.controller;
import com.example.asistencia.dto.request.LoginRequestDto;
import com.example.asistencia.dto.response.ApiResponse;
import com.example.asistencia.dto.response.LoginResponseDto;
import com.example.asistencia.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Autenticación", description = "Endpoints para autenticación y autorización")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Iniciar sesión", description = "Autentica un usuario y retorna un token JWT")
    public ResponseEntity<ApiResponse<LoginResponseDto>> login(@Valid @RequestBody LoginRequestDto loginRequest) {
        LoginResponseDto loginResponse = authService.login(loginRequest);
        return ResponseEntity.ok(ApiResponse.success(loginResponse, "Login exitoso"));
    }

    @PostMapping("/logout")
    @Operation(summary = "Cerrar sesión", description = "Cierra la sesión del usuario actual")
    public ResponseEntity<ApiResponse<?>> logout() {
        // En un sistema stateless con JWT, el logout se maneja en el cliente
        // eliminando el token del localStorage/sessionStorage
        return ResponseEntity.ok(ApiResponse.success("Logout exitoso"));
    }

    @GetMapping("/validate")
    @Operation(summary = "Validar token", description = "Valida si el token JWT es válido")
    public ResponseEntity<ApiResponse<?>> validateToken() {
        // Si llega aquí, el token es válido (pasó por el JwtAuthenticationFilter)
        return ResponseEntity.ok(ApiResponse.success("Token válido"));
    }
}