-- Crear tabla asistencias
CREATE TABLE asistencias (
                             id BIGSERIAL PRIMARY KEY,
                             colaborador_id BIGINT NOT NULL,
                             sede_id BIGINT NOT NULL,
                             fecha DATE NOT NULL,
                             hora_entrada TIME,
                             hora_salida TIME,
                             latitud_entrada DECIMAL(10, 8),
                             longitud_entrada DECIMAL(11, 8),
                             latitud_salida DECIMAL(10, 8),
                             longitud_salida DECIMAL(11, 8),
                             confianza_facial_entrada DECIMAL(5, 2),
                             confianza_facial_salida DECIMAL(5, 2),
                             imagen_entrada_path VARCHAR(500),
                             imagen_salida_path VARCHAR(500),
                             horas_trabajadas DECIMAL(5, 2),
                             estado VARCHAR(20) NOT NULL DEFAULT 'INCOMPLETA',
                             observaciones TEXT,
                             created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                             updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                             CONSTRAINT fk_asistencias_colaborador FOREIGN KEY (colaborador_id) REFERENCES colaboradores(id) ON DELETE CASCADE,
                             CONSTRAINT fk_asistencias_sede FOREIGN KEY (sede_id) REFERENCES sedes(id) ON DELETE CASCADE,
                             CONSTRAINT chk_estado CHECK (estado IN ('COMPLETA', 'INCOMPLETA', 'TARDANZA', 'FALTA')),
                             CONSTRAINT chk_horas_salida CHECK (hora_salida IS NULL OR hora_salida > hora_entrada)
);

-- Crear índices
CREATE INDEX idx_asistencias_colaborador ON asistencias(colaborador_id);
CREATE INDEX idx_asistencias_sede ON asistencias(sede_id);
CREATE INDEX idx_asistencias_fecha ON asistencias(fecha);
CREATE INDEX idx_asistencias_colaborador_fecha ON asistencias(colaborador_id, fecha);
CREATE INDEX idx_asistencias_sede_fecha ON asistencias(sede_id, fecha);
CREATE INDEX idx_asistencias_estado ON asistencias(estado);

-- Comentarios
COMMENT ON TABLE asistencias IS 'Tabla de registros de asistencia de colaboradores';
COMMENT ON COLUMN asistencias.estado IS 'Estado: COMPLETA, INCOMPLETA, TARDANZA, FALTA';
COMMENT ON COLUMN asistencias.horas_trabajadas IS 'Horas trabajadas calculadas automáticamente';