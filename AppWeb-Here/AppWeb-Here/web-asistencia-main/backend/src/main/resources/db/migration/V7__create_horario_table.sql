-- Crear tabla horarios
CREATE TABLE horarios (
                          id BIGSERIAL PRIMARY KEY,
                          colaborador_id BIGINT NOT NULL,
                          dia_semana VARCHAR(20) NOT NULL,
                          hora_inicio TIME NOT NULL,
                          hora_fin TIME NOT NULL,
                          activo BOOLEAN NOT NULL DEFAULT TRUE,
                          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          CONSTRAINT fk_horarios_colaborador FOREIGN KEY (colaborador_id) REFERENCES colaboradores(id) ON DELETE CASCADE,
                          CONSTRAINT chk_dia_semana CHECK (dia_semana IN ('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO')),
                          CONSTRAINT chk_hora_fin CHECK (hora_fin > hora_inicio)
);

-- Crear índices
CREATE INDEX idx_horarios_colaborador ON horarios(colaborador_id);
CREATE INDEX idx_horarios_colaborador_dia ON horarios(colaborador_id, dia_semana);
CREATE INDEX idx_horarios_activo ON horarios(activo);

-- Comentarios
COMMENT ON TABLE horarios IS 'Tabla de horarios laborales de colaboradores';
COMMENT ON COLUMN horarios.dia_semana IS 'Día de la semana: LUNES, MARTES, MIERCOLES, JUEVES, VIERNES, SABADO, DOMINGO';