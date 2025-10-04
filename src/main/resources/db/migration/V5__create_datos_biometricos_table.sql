-- Crear tabla datos_biometricos
CREATE TABLE datos_biometricos (
                                   id BIGSERIAL PRIMARY KEY,
                                   colaborador_id BIGINT NOT NULL,
                                   imagen_path VARCHAR(500) NOT NULL,
                                   imagen_url VARCHAR(500),
                                   embeddings TEXT,
                                   calidad_imagen DECIMAL(5, 2),
                                   fecha_captura TIMESTAMP NOT NULL,
                                   es_principal BOOLEAN NOT NULL DEFAULT FALSE,
                                   activo BOOLEAN NOT NULL DEFAULT TRUE,
                                   created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                   updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                   CONSTRAINT fk_biometricos_colaborador FOREIGN KEY (colaborador_id) REFERENCES colaboradores(id) ON DELETE CASCADE
);

-- Crear índices
CREATE INDEX idx_biometricos_colaborador ON datos_biometricos(colaborador_id);
CREATE INDEX idx_biometricos_principal ON datos_biometricos(colaborador_id, es_principal) WHERE es_principal = TRUE;
CREATE INDEX idx_biometricos_activo ON datos_biometricos(activo);

-- Comentarios
COMMENT ON TABLE datos_biometricos IS 'Tabla de datos biométricos faciales de colaboradores';
COMMENT ON COLUMN datos_biometricos.embeddings IS 'Vector de características faciales en formato JSON';
COMMENT ON COLUMN datos_biometricos.es_principal IS 'Indica si es la imagen principal del colaborador';
COMMENT ON COLUMN datos_biometricos.calidad_imagen IS 'Puntuación de calidad de la imagen (0-100)';