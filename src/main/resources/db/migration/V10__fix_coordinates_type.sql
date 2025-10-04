-- Corregir tipos de coordenadas en tabla sedes
ALTER TABLE sedes
ALTER COLUMN latitud TYPE DOUBLE PRECISION,
    ALTER COLUMN longitud TYPE DOUBLE PRECISION;

-- Corregir tipos de coordenadas en tabla asistencias
ALTER TABLE asistencias
ALTER COLUMN latitud_entrada TYPE DOUBLE PRECISION,
    ALTER COLUMN longitud_entrada TYPE DOUBLE PRECISION,
    ALTER COLUMN latitud_salida TYPE DOUBLE PRECISION,
    ALTER COLUMN longitud_salida TYPE DOUBLE PRECISION;