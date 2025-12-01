-- Crear tabla sedes
CREATE TABLE sedes (
                       id BIGSERIAL PRIMARY KEY,
                       empresa_id BIGINT NOT NULL,
                       codigo VARCHAR(20) NOT NULL UNIQUE,
                       nombre VARCHAR(200) NOT NULL,
                       direccion VARCHAR(255),
                       distrito VARCHAR(100),
                       provincia VARCHAR(100),
                       departamento VARCHAR(100),
                       latitud DECIMAL(10, 8),
                       longitud DECIMAL(11, 8),
                       radio_metros INTEGER NOT NULL DEFAULT 50,
                       activo BOOLEAN NOT NULL DEFAULT TRUE,
                       created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       CONSTRAINT fk_sedes_empresa FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
                       CONSTRAINT chk_radio_metros CHECK (radio_metros BETWEEN 20 AND 200)
);

-- Crear índices
CREATE INDEX idx_sedes_empresa ON sedes(empresa_id);
CREATE INDEX idx_sedes_codigo ON sedes(codigo);
CREATE INDEX idx_sedes_activo ON sedes(activo);

-- Comentarios
COMMENT ON TABLE sedes IS 'Tabla de sedes/sucursales de las empresas';
COMMENT ON COLUMN sedes.codigo IS 'Código único de la sede';
COMMENT ON COLUMN sedes.radio_metros IS 'Radio de cobertura GPS en metros (20-200)';