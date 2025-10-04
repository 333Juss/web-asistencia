-- Crear tabla auditoria
CREATE TABLE auditoria (
                           id BIGSERIAL PRIMARY KEY,
                           usuario_id BIGINT,
                           entidad VARCHAR(100) NOT NULL,
                           entidad_id BIGINT,
                           accion VARCHAR(20) NOT NULL,
                           datos_anteriores TEXT,
                           datos_nuevos TEXT,
                           ip_address VARCHAR(50),
                           user_agent VARCHAR(500),
                           created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           CONSTRAINT fk_auditoria_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
                           CONSTRAINT chk_accion CHECK (accion IN ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT'))
);

-- Crear índices
CREATE INDEX idx_auditoria_usuario ON auditoria(usuario_id);
CREATE INDEX idx_auditoria_entidad ON auditoria(entidad, entidad_id);
CREATE INDEX idx_auditoria_accion ON auditoria(accion);
CREATE INDEX idx_auditoria_fecha ON auditoria(created_at);

-- Comentarios
COMMENT ON TABLE auditoria IS 'Tabla de auditoría de acciones del sistema';
COMMENT ON COLUMN auditoria.accion IS 'Acción realizada: CREATE, UPDATE, DELETE, LOGIN, LOGOUT';
COMMENT ON COLUMN auditoria.entidad IS 'Nombre de la entidad afectada';
COMMENT ON COLUMN auditoria.datos_anteriores IS 'Datos antes de la modificación en formato JSON';
COMMENT ON COLUMN auditoria.datos_nuevos IS 'Datos después de la modificación en formato JSON';