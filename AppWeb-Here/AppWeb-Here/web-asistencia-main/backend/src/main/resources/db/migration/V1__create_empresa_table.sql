-- Crear tabla empresas
CREATE TABLE empresas (
                          id BIGSERIAL PRIMARY KEY,
                          ruc VARCHAR(11) NOT NULL UNIQUE,
                          razon_social VARCHAR(200) NOT NULL,
                          nombre_comercial VARCHAR(200),
                          direccion VARCHAR(255),
                          ciudad VARCHAR(100),
                          departamento VARCHAR(100),
                          codigo_postal VARCHAR(10),
                          telefono VARCHAR(20),
                          categoria VARCHAR(100),
                          descripcion TEXT,
                          cantidad_empleados INTEGER,
                          activo BOOLEAN NOT NULL DEFAULT TRUE,
                          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices
CREATE INDEX idx_empresas_ruc ON empresas(ruc);
CREATE INDEX idx_empresas_activo ON empresas(activo);

-- Comentarios
COMMENT ON TABLE empresas IS 'Tabla de empresas registradas en el sistema';
COMMENT ON COLUMN empresas.ruc IS 'Registro Único de Contribuyentes (11 dígitos)';
COMMENT ON COLUMN empresas.razon_social IS 'Nombre legal de la empresa';