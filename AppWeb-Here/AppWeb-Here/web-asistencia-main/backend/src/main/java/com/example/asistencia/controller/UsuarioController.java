package com.example.asistencia.controller;

import com.example.asistencia.dto.request.ChangePasswordRequest;
import com.example.asistencia.dto.response.ApiResponse;
import com.example.asistencia.entity.Usuario;
import com.example.asistencia.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
@Tag(name = "Usuarios", description = "Gestión de usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/change-password")
    @Operation(summary = "Cambiar contraseña", description = "Permite al usuario cambiar su propia contraseña")
    public ResponseEntity<ApiResponse<Void>> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Usuario usuario = usuarioService.findByUsername(username);

        usuarioService.changePassword(usuario.getId(), request.getOldPassword(), request.getNewPassword());

        return ResponseEntity.ok(ApiResponse.success("Contraseña actualizada correctamente"));
    }
}
