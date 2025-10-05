-- Corregir tipos Double en tabla asistencias
ALTER TABLE asistencias
ALTER COLUMN confianza_facial_entrada TYPE DOUBLE PRECISION,
    ALTER COLUMN confianza_facial_salida TYPE DOUBLE PRECISION,
    ALTER COLUMN horas_trabajadas TYPE DOUBLE PRECISION;

-- Corregir tipos Double en tabla datos_biometricos
ALTER TABLE datos_biometricos
ALTER COLUMN calidad_imagen TYPE DOUBLE PRECISION;