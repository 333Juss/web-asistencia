-- ============================================
-- 1. TABLA TURNOS
-- ============================================
CREATE TABLE IF NOT EXISTS turnos (
                                      id SERIAL PRIMARY KEY,
                                      nombre VARCHAR(50) NOT NULL UNIQUE,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    tolerancia_minutos INT NOT NULL DEFAULT 0,
    activo BOOLEAN NOT NULL DEFAULT TRUE
    );
-- ============================================
-- 2. AGREGAR CAMPO turno_id A COLABORADORES
-- ============================================
ALTER TABLE colaboradores
    ADD COLUMN IF NOT EXISTS turno_id INT NULL REFERENCES turnos(id);
ALTER TABLE colaboradores
    ADD COLUMN IF NOT EXISTS fecha_inicio_turno DATE;

-- ============================================
-- 3. TABLA JUSTIFICACIONES
-- ============================================
CREATE TABLE IF NOT EXISTS justificaciones (
                                               id SERIAL PRIMARY KEY,
                                               colaborador_id INT NOT NULL REFERENCES colaboradores(id),
    motivo TEXT NOT NULL,
    evidencia_path TEXT,
    estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW(),
    fecha_revision TIMESTAMP,
    supervisor_id INT REFERENCES colaboradores(id)
    );

-- ============================================
-- 4. INSERTAR TURNOS POR DEFECTO
-- ============================================
INSERT INTO turnos (id, nombre, hora_inicio, hora_fin, tolerancia_minutos, activo)
VALUES
    (1, 'Mañana', '08:00', '16:00', 10, TRUE),
    (2, 'Tarde',  '16:00', '00:00', 10, TRUE),
    (3, 'Noche',  '00:00', '08:00', 10, TRUE)
    ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 5. CREAR ENUM PARA ESTADO_ASISTENCIA
-- ============================================
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'estado_asistencia_enum'
    ) THEN
CREATE TYPE estado_asistencia_enum AS ENUM (
            'FALTA',
            'TARDANZA',
            'COMPLETA',
            'INCOMPLETA',
            'PENDIENTE_JUSTIFICACION',
            'JUSTIFICADA'
        );
END IF;
END $$;

-- ============================================
-- 6. ELIMINAR CHECK OBSOLETO
-- ============================================
ALTER TABLE asistencias
DROP CONSTRAINT IF EXISTS chk_estado;

-- ============================================
-- 7. CONVERTIR COLUMNA A ENUM (UNA SOLA VEZ)
-- ============================================
ALTER TABLE asistencias
    ALTER COLUMN estado DROP DEFAULT,
ALTER COLUMN estado TYPE estado_asistencia_enum USING estado::estado_asistencia_enum,
    ALTER COLUMN estado SET DEFAULT 'INCOMPLETA';
