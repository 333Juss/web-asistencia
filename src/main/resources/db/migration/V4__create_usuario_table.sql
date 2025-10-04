-- Crear tabla usuarios
CREATE TABLE usuarios (
                          id BIGSERIAL PRIMARY KEY,
                          colaborador_id BIGINT,
                          username VARCHAR(50) NOT NULL UNIQUE,
                          password VARCHAR(255) NOT NULL,
                          rol VARCHAR(20) NOT NULL,
                          ultimo_acceso TIMESTAMP,
                          intentos_fallidos INTEGER NOT NULL DEFAULT 0,
                          bloqueado BOOLEAN NOT NULL DEFAULT FALSE,
                          activo BOOLEAN NOT NULL DEFAULT TRUE,
                          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          CONSTRAINT fk_usuarios_colaborador FOREIGN KEY (colaborador_id) REFERENCES colaboradores(id) ON DELETE SET NULL,
                          CONSTRAINT chk_rol CHECK (rol IN ('ADMIN', 'RRHH', 'EMPLEADO', 'SUPERVISOR'))
);

-- Crear índices
CREATE INDEX idx_usuarios_colaborador ON usuarios(colaborador_id);
CREATE INDEX idx_usuarios_username ON usuarios(username);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);
CREATE INDEX idx_usuarios_activo ON usuarios(activo);

-- Comentarios
COMMENT ON TABLE usuarios IS 'Tabla de usuarios del sistema';
COMMENT ON COLUMN usuarios.rol IS 'Rol del usuario: ADMIN, RRHH, EMPLEADO, SUPERVISOR';
COMMENT ON COLUMN usuarios.intentos_fallidos IS 'Contador de intentos fallidos de login';
COMMENT ON COLUMN usuarios.bloqueado IS 'Indica si el usuario está bloqueado por seguridad';