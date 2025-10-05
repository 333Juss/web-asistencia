-- Crear tabla colaboradores
CREATE TABLE colaboradores (
                               id BIGSERIAL PRIMARY KEY,
                               empresa_id BIGINT NOT NULL,
                               sede_id BIGINT,
                               dni VARCHAR(8) NOT NULL UNIQUE,
                               nombres VARCHAR(100) NOT NULL,
                               apellidos VARCHAR(100) NOT NULL,
                               email VARCHAR(100) NOT NULL UNIQUE,
                               telefono VARCHAR(20),
                               fecha_nacimiento DATE,
                               fecha_ingreso DATE,
                               cargo VARCHAR(100),
                               tiene_datos_biometricos BOOLEAN NOT NULL DEFAULT FALSE,
                               activo BOOLEAN NOT NULL DEFAULT TRUE,
                               created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                               updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                               CONSTRAINT fk_colaboradores_empresa FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
                               CONSTRAINT fk_colaboradores_sede FOREIGN KEY (sede_id) REFERENCES sedes(id) ON DELETE SET NULL,
                               CONSTRAINT chk_dni_length CHECK (LENGTH(dni) = 8)
);

-- Crear índices
CREATE INDEX idx_colaboradores_empresa ON colaboradores(empresa_id);
CREATE INDEX idx_colaboradores_sede ON colaboradores(sede_id);
CREATE INDEX idx_colaboradores_dni ON colaboradores(dni);
CREATE INDEX idx_colaboradores_email ON colaboradores(email);
CREATE INDEX idx_colaboradores_activo ON colaboradores(activo);

-- Comentarios
COMMENT ON TABLE colaboradores IS 'Tabla de colaboradores/empleados de las empresas';
COMMENT ON COLUMN colaboradores.dni IS 'Documento Nacional de Identidad (8 dígitos)';
COMMENT ON COLUMN colaboradores.tiene_datos_biometricos IS 'Indica si el colaborador tiene datos biométricos registrados';