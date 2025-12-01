-- ============================================
-- SCRIPT DE DATOS DE PRUEBA PARA DESARROLLO
-- ============================================
-- Este script inserta datos de ejemplo para poder probar el sistema
-- Incluye: sedes, colaboradores, datos biométricos y asistencias

-- ============================================
-- 1. INSERTAR SEDES ADICIONALES
-- ============================================
-- Obtener el ID de la primera sede existente
DO $$
DECLARE
    sede_central_id BIGINT;
BEGIN
    SELECT id INTO sede_central_id FROM sedes ORDER BY id LIMIT 1;

    -- Insertar sedes adicionales solo si no existen
    INSERT INTO sedes (empresa_id, codigo, nombre, direccion, distrito, provincia, departamento, latitud, longitud, radio_metros, activo)
    SELECT 1, 'SEDE-002', 'Sede Miraflores', 'Av. Larco 456', 'Miraflores', 'Lima', 'Lima', -12.1197100, -77.0343800, 75, TRUE
    WHERE NOT EXISTS (SELECT 1 FROM sedes WHERE codigo = 'SEDE-002');

    INSERT INTO sedes (empresa_id, codigo, nombre, direccion, distrito, provincia, departamento, latitud, longitud, radio_metros, activo)
    SELECT 1, 'SEDE-003', 'Sede San Miguel', 'Av. La Marina 789', 'San Miguel', 'Lima', 'Lima', -12.0767100, -77.0843800, 60, TRUE
    WHERE NOT EXISTS (SELECT 1 FROM sedes WHERE codigo = 'SEDE-003');

    INSERT INTO sedes (empresa_id, codigo, nombre, direccion, distrito, provincia, departamento, latitud, longitud, radio_metros, activo)
    SELECT 1, 'SEDE-004', 'Sede Surco', 'Av. Santiago de Surco 321', 'Surco', 'Lima', 'Lima', -12.1397100, -77.0043800, 50, TRUE
    WHERE NOT EXISTS (SELECT 1 FROM sedes WHERE codigo = 'SEDE-004');

    INSERT INTO sedes (empresa_id, codigo, nombre, direccion, distrito, provincia, departamento, latitud, longitud, radio_metros, activo)
    SELECT 1, 'SEDE-005', 'Sede Los Olivos', 'Av. Universitaria 654', 'Los Olivos', 'Lima', 'Lima', -11.9697100, -77.0743800, 80, TRUE
    WHERE NOT EXISTS (SELECT 1 FROM sedes WHERE codigo = 'SEDE-005');
END $$;
-- ============================================
-- 2. INSERTAR COLABORADORES DE PRUEBA (ACTUALIZADO)
-- ============================================

INSERT INTO colaboradores (
    empresa_id, sede_id, dni, nombres, apellidos, email, telefono,
    fecha_nacimiento, fecha_ingreso, cargo, tiene_datos_biometricos, activo,
    fecha_inicio_turno
)
SELECT
    1,
    (SELECT id FROM sedes WHERE codigo = 'SEDE-001' LIMIT 1),
    '45678901', 'Carlos', 'Rodríguez García', 'carlos.rodriguez@empresa.com', '987654321',
    '1990-03-15', '2022-01-10', 'Gerente General', TRUE, TRUE,
    '2022-01-10'
WHERE NOT EXISTS (SELECT 1 FROM colaboradores WHERE dni = '45678901');


INSERT INTO colaboradores (
    empresa_id, sede_id, dni, nombres, apellidos, email, telefono,
    fecha_nacimiento, fecha_ingreso, cargo, tiene_datos_biometricos, activo,
    fecha_inicio_turno
)
SELECT
    1,
    (SELECT id FROM sedes WHERE codigo = 'SEDE-001' LIMIT 1),
    '45678902', 'María', 'López Fernández', 'maria.lopez@empresa.com', '987654322',
    '1988-07-22', '2021-06-15', 'Jefe de RRHH', TRUE, TRUE,
    '2021-06-15'
WHERE NOT EXISTS (SELECT 1 FROM colaboradores WHERE dni = '45678902');


INSERT INTO colaboradores (
    empresa_id, sede_id, dni, nombres, apellidos, email, telefono,
    fecha_nacimiento, fecha_ingreso, cargo, tiene_datos_biometricos, activo,
    fecha_inicio_turno
)
SELECT
    1,
    (SELECT id FROM sedes WHERE codigo = 'SEDE-001' LIMIT 1),
    '45678903', 'José', 'Martínez Sánchez', 'jose.martinez@empresa.com', '987654323',
    '1992-11-08', '2023-02-20', 'Desarrollador Senior', TRUE, TRUE,
    '2023-02-20'
WHERE NOT EXISTS (SELECT 1 FROM colaboradores WHERE dni = '45678903');


INSERT INTO colaboradores (
    empresa_id, sede_id, dni, nombres, apellidos, email, telefono,
    fecha_nacimiento, fecha_ingreso, cargo, tiene_datos_biometricos, activo,
    fecha_inicio_turno
)
SELECT
    1,
    (SELECT id FROM sedes WHERE codigo = 'SEDE-001' LIMIT 1),
    '45678904', 'Ana', 'García Torres', 'ana.garcia@empresa.com', '987654324',
    '1995-04-30', '2023-03-15', 'Analista de Sistemas', TRUE, TRUE,
    '2023-03-15'
WHERE NOT EXISTS (SELECT 1 FROM colaboradores WHERE dni = '45678904');


INSERT INTO colaboradores (
    empresa_id, sede_id, dni, nombres, apellidos, email, telefono,
    fecha_nacimiento, fecha_ingreso, cargo, tiene_datos_biometricos, activo,
    fecha_inicio_turno
)
SELECT
    1,
    (SELECT id FROM sedes WHERE codigo = 'SEDE-001' LIMIT 1),
    '45678905', 'Luis', 'Pérez Ramírez', 'luis.perez@empresa.com', '987654325',
    '1991-09-12', '2022-08-10', 'Contador', TRUE, TRUE,
    '2022-08-10'
WHERE NOT EXISTS (SELECT 1 FROM colaboradores WHERE dni = '45678905');


-- Sede Miraflores -----------------------------------------------------------
INSERT INTO colaboradores (
    empresa_id, sede_id, dni, nombres, apellidos, email, telefono,
    fecha_nacimiento, fecha_ingreso, cargo, tiene_datos_biometricos, activo,
    fecha_inicio_turno
)
SELECT
    1,
    (SELECT id FROM sedes WHERE codigo = 'SEDE-002' LIMIT 1),
    '45678906', 'Carmen', 'Vega Morales', 'carmen.vega@empresa.com', '987654326',
    '1993-01-25', '2022-05-01', 'Supervisor de Ventas', TRUE, TRUE,
    '2022-05-01'
WHERE NOT EXISTS (SELECT 1 FROM colaboradores WHERE dni = '45678906');


INSERT INTO colaboradores (
    empresa_id, sede_id, dni, nombres, apellidos, email, telefono,
    fecha_nacimiento, fecha_ingreso, cargo, tiene_datos_biometricos, activo,
    fecha_inicio_turno
)
SELECT
    1,
    (SELECT id FROM sedes WHERE codigo = 'SEDE-002' LIMIT 1),
    '45678907', 'Roberto', 'Flores Castro', 'roberto.flores@empresa.com', '987654327',
    '1989-06-18', '2021-09-20', 'Vendedor Senior', TRUE, TRUE,
    '2021-09-20'
WHERE NOT EXISTS (SELECT 1 FROM colaboradores WHERE dni = '45678907');


INSERT INTO colaboradores (
    empresa_id, sede_id, dni, nombres, apellidos, email, telefono,
    fecha_nacimiento, fecha_ingreso, cargo, tiene_datos_biometricos, activo,
    fecha_inicio_turno
)
SELECT
    1,
    (SELECT id FROM sedes WHERE codigo = 'SEDE-002' LIMIT 1),
    '45678908', 'Patricia', 'Díaz Vargas', 'patricia.diaz@empresa.com', '987654328',
    '1994-12-03', '2023-01-15', 'Asistente de Ventas', TRUE, TRUE,
    '2023-01-15'
WHERE NOT EXISTS (SELECT 1 FROM colaboradores WHERE dni = '45678908');


INSERT INTO colaboradores (
    empresa_id, sede_id, dni, nombres, apellidos, email, telefono,
    fecha_nacimiento, fecha_ingreso, cargo, tiene_datos_biometricos, activo,
    fecha_inicio_turno
)
SELECT
    1,
    (SELECT id FROM sedes WHERE codigo = 'SEDE-002' LIMIT 1),
    '45678909', 'Fernando', 'Rojas Mendoza', 'fernando.rojas@empresa.com', '987654329',
    '1990-08-27', '2022-11-10', 'Diseñador Gráfico', TRUE, TRUE,
    '2022-11-10'
WHERE NOT EXISTS (SELECT 1 FROM colaboradores WHERE dni = '45678909');


-- Sede San Miguel -----------------------------------------------------------
INSERT INTO colaboradores (
    empresa_id, sede_id, dni, nombres, apellidos, email, telefono,
    fecha_nacimiento, fecha_ingreso, cargo, tiene_datos_biometricos, activo,
    fecha_inicio_turno
)
SELECT
    1,
    (SELECT id FROM sedes WHERE codigo = 'SEDE-003' LIMIT 1),
    '45678910', 'Isabel', 'Campos Silva', 'isabel.campos@empresa.com', '987654330',
    '1992-02-14', '2022-04-05', 'Jefe de Logística', TRUE, TRUE,
    '2022-04-05'
WHERE NOT EXISTS (SELECT 1 FROM colaboradores WHERE dni = '45678910');


INSERT INTO colaboradores (
    empresa_id, sede_id, dni, nombres, apellidos, email, telefono,
    fecha_nacimiento, fecha_ingreso, cargo, tiene_datos_biometricos, activo,
    fecha_inicio_turno
)
SELECT
    1,
    (SELECT id FROM sedes WHERE codigo = 'SEDE-003' LIMIT 1),
    '45678911', 'Miguel', 'Herrera Ortiz', 'miguel.herrera@empresa.com', '987654331',
    '1991-10-09', '2021-12-01', 'Almacenero', TRUE, TRUE,
    '2021-12-01'
WHERE NOT EXISTS (SELECT 1 FROM colaboradores WHERE dni = '45678911');


INSERT INTO colaboradores (
    empresa_id, sede_id, dni, nombres, apellidos, email, telefono,
    fecha_nacimiento, fecha_ingreso, cargo, tiene_datos_biometricos, activo,
    fecha_inicio_turno
)
SELECT
    1,
    (SELECT id FROM sedes WHERE codigo = 'SEDE-003' LIMIT 1),
    '45678912', 'Laura', 'Cruz Paredes', 'laura.cruz@empresa.com', '987654332',
    '1996-05-21', '2023-04-15', 'Asistente de Almacén', TRUE, TRUE,
    '2023-04-15'
WHERE NOT EXISTS (SELECT 1 FROM colaboradores WHERE dni = '45678912');


-- Sede Surco ---------------------------------------------------------------
INSERT INTO colaboradores (
    empresa_id, sede_id, dni, nombres, apellidos, email, telefono,
    fecha_nacimiento, fecha_ingreso, cargo, tiene_datos_biometricos, activo,
    fecha_inicio_turno
)
SELECT
    1,
    (SELECT id FROM sedes WHERE codigo = 'SEDE-004' LIMIT 1),
    '45678913', 'Diego', 'Reyes Gutiérrez', 'diego.reyes@empresa.com', '987654333',
    '1987-11-30', '2020-08-10', 'Jefe de Operaciones', TRUE, TRUE,
    '2020-08-10'
WHERE NOT EXISTS (SELECT 1 FROM colaboradores WHERE dni = '45678913');


INSERT INTO colaboradores (
    empresa_id, sede_id, dni, nombres, apellidos, email, telefono,
    fecha_nacimiento, fecha_ingreso, cargo, tiene_datos_biometricos, activo,
    fecha_inicio_turno
)
SELECT
    1,
    (SELECT id FROM sedes WHERE codigo = 'SEDE-004' LIMIT 1),
    '45678914', 'Sofía', 'Mendoza Ramos', 'sofia.mendoza@empresa.com', '987654334',
    '1993-07-16', '2022-02-20', 'Coordinadora de Proyectos', TRUE, TRUE,
    '2022-02-20'
WHERE NOT EXISTS (SELECT 1 FROM colaboradores WHERE dni = '45678914');


INSERT INTO colaboradores (
    empresa_id, sede_id, dni, nombres, apellidos, email, telefono,
    fecha_nacimiento, fecha_ingreso, cargo, tiene_datos_biometricos, activo,
    fecha_inicio_turno
)
SELECT
    1,
    (SELECT id FROM sedes WHERE codigo = 'SEDE-004' LIMIT 1),
    '45678915', 'Ricardo', 'Salazar Torres', 'ricardo.salazar@empresa.com', '987654335',
    '1994-03-08', '2023-05-01', 'Desarrollador Junior', TRUE, TRUE,
    '2023-05-01'
WHERE NOT EXISTS (SELECT 1 FROM colaboradores WHERE dni = '45678915');


-- Sede Los Olivos ----------------------------------------------------------
INSERT INTO colaboradores (
    empresa_id, sede_id, dni, nombres, apellidos, email, telefono,
    fecha_nacimiento, fecha_ingreso, cargo, tiene_datos_biometricos, activo,
    fecha_inicio_turno
)
SELECT
    1,
    (SELECT id FROM sedes WHERE codigo = 'SEDE-005' LIMIT 1),
    '45678916', 'Gabriela', 'Navarro Castro', 'gabriela.navarro@empresa.com', '987654336',
    '1991-12-19', '2021-11-15', 'Jefe de Marketing', TRUE, TRUE,
    '2021-11-15'
WHERE NOT EXISTS (SELECT 1 FROM colaboradores WHERE dni = '45678916');


INSERT INTO colaboradores (
    empresa_id, sede_id, dni, nombres, apellidos, email, telefono,
    fecha_nacimiento, fecha_ingreso, cargo, tiene_datos_biometricos, activo,
    fecha_inicio_turno
)
SELECT
    1,
    (SELECT id FROM sedes WHERE codigo = 'SEDE-005' LIMIT 1),
    '45678917', 'Andrés', 'Paredes Jiménez', 'andres.paredes@empresa.com', '987654337',
    '1995-09-04', '2023-02-10', 'Community Manager', TRUE, TRUE,
    '2023-02-10'
WHERE NOT EXISTS (SELECT 1 FROM colaboradores WHERE dni = '45678917');


INSERT INTO colaboradores (
    empresa_id, sede_id, dni, nombres, apellidos, email, telefono,
    fecha_nacimiento, fecha_ingreso, cargo, tiene_datos_biometricos, activo,
    fecha_inicio_turno
)
SELECT
    1,
    (SELECT id FROM sedes WHERE codigo = 'SEDE-005' LIMIT 1),
    '45678918', 'Valeria', 'Quispe León', 'valeria.quispe@empresa.com', '987654338',
    '1992-04-26', '2022-07-20', 'Diseñadora UX/UI', TRUE, TRUE,
    '2022-07-20'
WHERE NOT EXISTS (SELECT 1 FROM colaboradores WHERE dni = '45678918');


-- Sin sede asignada --------------------------------------------------------
INSERT INTO colaboradores (
    empresa_id, sede_id, dni, nombres, apellidos, email, telefono,
    fecha_nacimiento, fecha_ingreso, cargo, tiene_datos_biometricos, activo,
    fecha_inicio_turno
)
SELECT
    1, NULL,
    '45678919', 'Javier', 'Morales Soto', 'javier.morales@empresa.com', '987654339',
    '1990-01-12', '2023-06-01', 'Consultor Externo', FALSE, TRUE,
    '2023-06-01'
    WHERE NOT EXISTS (SELECT 1 FROM colaboradores WHERE dni = '45678919');


INSERT INTO colaboradores (
    empresa_id, sede_id, dni, nombres, apellidos, email, telefono,
    fecha_nacimiento, fecha_ingreso, cargo, tiene_datos_biometricos, activo,
    fecha_inicio_turno
)
SELECT
    1, NULL,
    '45678920', 'Claudia', 'Fernández Ruiz', 'claudia.fernandez@empresa.com', '987654340',
    '1993-08-07', '2023-07-15', 'Practicante', FALSE, TRUE,
    '2023-07-15'
    WHERE NOT EXISTS (SELECT 1 FROM colaboradores WHERE dni = '45678920');

-- ============================================
-- 3. INSERTAR DATOS BIOMÉTRICOS SIMULADOS
-- ============================================
-- Nota: Los embeddings son simulados, en producción se generarían con un modelo de reconocimiento facial
INSERT INTO datos_biometricos (
    colaborador_id, imagen_path, imagen_url, embeddings,
    calidad_imagen, fecha_captura, es_principal, activo
)
SELECT
    c.id,
    '/uploads/biometric/face_' || c.dni || '_001.jpg',
    'http://localhost:8080/api/biometric/face_' || c.dni || '_001.jpg',
    '{"vector": [' || string_agg((random() * 2 - 1)::text, ',') || ']}',
    85.00 + (random() * 15)::numeric(5,2),
            CURRENT_TIMESTAMP - (random() * interval '60 days'),
    TRUE,
    TRUE
FROM colaboradores c
         CROSS JOIN generate_series(1, 128)
WHERE c.tiene_datos_biometricos = TRUE
GROUP BY c.id, c.dni
    ON CONFLICT DO NOTHING;


-- Insertar imágenes adicionales (no principales) para algunos colaboradores
INSERT INTO datos_biometricos (
    colaborador_id, imagen_path, imagen_url, embeddings,
    calidad_imagen, fecha_captura, es_principal, activo
)
SELECT
    c.id,
    '/uploads/biometric/face_' || c.dni || '_' || serie || '.jpg',
    'http://localhost:8080/api/biometric/face_' || c.dni || '_' || serie || '.jpg',
    '{"vector": [' || string_agg((random() * 2 - 1)::text, ',') || ']}',
    80.00 + (random() * 20)::numeric(5,2),
            CURRENT_TIMESTAMP - (random() * interval '30 days'),
    FALSE,
    TRUE
FROM colaboradores c
         CROSS JOIN generate_series(2, 3) as serie
         CROSS JOIN generate_series(1, 128)
WHERE c.tiene_datos_biometricos = TRUE
  AND c.id % 3 = 0
GROUP BY c.id, c.dni, serie
ON CONFLICT DO NOTHING;


-- ============================================
-- 4. INSERTAR ASISTENCIAS DE LOS ÚLTIMOS 30 DÍAS
-- ============================================
-- Generar asistencias para días laborables (lunes a viernes) de los últimos 30 días

INSERT INTO asistencias (
    colaborador_id,
    sede_id,
    fecha,
    hora_entrada,
    hora_salida,
    latitud_entrada,
    longitud_entrada,
    latitud_salida,
    longitud_salida,
    confianza_facial_entrada,
    confianza_facial_salida,
    imagen_entrada_path,
    imagen_salida_path,
    horas_trabajadas,
    estado,
    observaciones
)
SELECT
    c.id as colaborador_id,
    COALESCE(c.sede_id, 1) as sede_id,
    dia::DATE as fecha,
    -- Hora de entrada: entre 08:00 y 09:30 (con variación aleatoria)
    ('08:00:00'::TIME + (random() * interval '90 minutes'))::TIME as hora_entrada,
    -- Hora de salida: entre 17:00 y 18:30 (con variación aleatoria)
    ('17:00:00'::TIME + (random() * interval '90 minutes'))::TIME as hora_salida,
    -- Coordenadas de entrada (cerca de la sede)
    s.latitud + (random() * 0.001 - 0.0005) as latitud_entrada,
    s.longitud + (random() * 0.001 - 0.0005) as longitud_entrada,
    -- Coordenadas de salida (cerca de la sede)
    s.latitud + (random() * 0.001 - 0.0005) as latitud_salida,
    s.longitud + (random() * 0.001 - 0.0005) as longitud_salida,
    -- Confianza facial entre 85% y 99%
    (85 + random() * 14)::numeric(5,2) as confianza_facial_entrada,
    (85 + random() * 14)::numeric(5,2) as confianza_facial_salida,
    -- Paths de imágenes
    '/uploads/attendance/entrada_' || c.dni || '_' || to_char(dia, 'YYYYMMDD') || '.jpg' as imagen_entrada_path,
    '/uploads/attendance/salida_' || c.dni || '_' || to_char(dia, 'YYYYMMDD') || '.jpg' as imagen_salida_path,
    -- Horas trabajadas: entre 8 y 9.5 horas
    (8 + random() * 1.5)::numeric(5,2) as horas_trabajadas,
    -- Estado: COMPLETA, TARDANZA (10% de probabilidad), o INCOMPLETA (5% de probabilidad)
    CASE
        WHEN random() < 0.05 THEN 'INCOMPLETA'::estado_asistencia_enum
        WHEN random() < 0.15 THEN 'TARDANZA'::estado_asistencia_enum
        ELSE 'COMPLETA'::estado_asistencia_enum
        END as estado,
    -- Observaciones solo para casos especiales
    CASE
        WHEN random() < 0.05 THEN 'Sin registro de salida'
        WHEN random() < 0.15 THEN 'Tardanza justificada - Tráfico'
        ELSE NULL
    END as observaciones
FROM
    colaboradores c
    CROSS JOIN generate_series(
        CURRENT_DATE - interval '30 days',
        CURRENT_DATE - interval '1 day',
        interval '1 day'
    ) as dia
    LEFT JOIN sedes s ON s.id = COALESCE(c.sede_id, 1)
WHERE
    c.activo = TRUE
    AND c.sede_id IS NOT NULL -- Solo colaboradores con sede asignada
    AND EXTRACT(DOW FROM dia) NOT IN (0, 6) -- Excluir domingos (0) y sábados (6)
    AND random() > 0.05 -- 95% de probabilidad de asistencia (simular algunas faltas)
ON CONFLICT DO NOTHING;

-- ============================================
-- 5. INSERTAR ASISTENCIAS INCOMPLETAS (SOLO ENTRADA)
-- ============================================
-- Algunas asistencias del día actual solo con entrada (sin salida)
INSERT INTO asistencias (
    colaborador_id,
    sede_id,
    fecha,
    hora_entrada,
    hora_salida,
    latitud_entrada,
    longitud_entrada,
    confianza_facial_entrada,
    imagen_entrada_path,
    estado,
    observaciones
)
SELECT
    c.id as colaborador_id,
    COALESCE(c.sede_id, 1) as sede_id,
    CURRENT_DATE as fecha,
    ('08:00:00'::TIME + (random() * interval '90 minutes'))::TIME as hora_entrada,
    NULL as hora_salida,
    s.latitud + (random() * 0.001 - 0.0005) as latitud_entrada,
    s.longitud + (random() * 0.001 - 0.0005) as longitud_entrada,
    (85 + random() * 14)::numeric(5,2) as confianza_facial_entrada,
    '/uploads/attendance/entrada_' || c.dni || '_' || to_char(CURRENT_DATE, 'YYYYMMDD') || '.jpg' as imagen_entrada_path,
    'INCOMPLETA' as estado,
    'Jornada en curso' as observaciones
FROM
    colaboradores c
    LEFT JOIN sedes s ON s.id = COALESCE(c.sede_id, 1)
WHERE
    c.activo = TRUE
  AND c.sede_id IS NOT NULL
  AND random() > 0.3
  AND EXTRACT(DOW FROM CURRENT_DATE) NOT IN (0, 6);

-- ============================================
-- 6. ACTUALIZAR ESTADÍSTICAS
-- ============================================
-- Actualizar el campo tiene_datos_biometricos basado en los datos insertados
UPDATE colaboradores c
SET tiene_datos_biometricos = TRUE
WHERE EXISTS (
    SELECT 1 FROM datos_biometricos db
    WHERE db.colaborador_id = c.id AND db.activo = TRUE
);

-- ============================================
-- 7. CREAR USUARIOS PARA COLABORADORES
-- ============================================
-- Password por defecto: "password123"
-- Hash BCrypt: $2a$12$B4fjZxhy.Hulpp4RkA9Mdexau7ly8/VZzMkb7OhfwpsRo13VVLyCi
INSERT INTO usuarios (colaborador_id, username, password, rol, activo)
SELECT
    c.id,
    LOWER(
            REPLACE(
                    REPLACE(
                            REPLACE(
                                    REPLACE(
                                            REPLACE(c.nombres, ' ', '.'),
                                            'á','a'),
                                    'é','e'),
                            'í','i'),
                    'ó','o')
    ) || '.' ||
    LOWER(
            REPLACE(
                    REPLACE(
                            REPLACE(
                                    REPLACE(
                                            REPLACE(SPLIT_PART(c.apellidos, ' ', 1), 'á','a'),
                                            'é','e'),
                                    'í','i'),
                            'ó','o'),
                    'ú','u')
    ),
    '$2a$12$B4fjZxhy.Hulpp4RkA9Mdexau7ly8/VZzMkb7OhfwpsRo13VVLyCi', -- password123
    CASE
        WHEN c.cargo ILIKE '%gerente%' THEN 'ADMIN'
        WHEN c.cargo ILIKE '%jefe%' THEN 'RRHH'
        WHEN c.cargo ILIKE '%supervisor%' OR c.cargo ILIKE '%coordinador%' THEN 'SUPERVISOR'
        ELSE 'EMPLEADO'
END,
    TRUE
FROM colaboradores c
WHERE NOT EXISTS (
    SELECT 1 FROM usuarios u WHERE u.colaborador_id = c.id
);

-- ============================================
-- COMENTARIOS Y DOCUMENTACIÓN
-- ============================================
COMMENT ON TABLE colaboradores IS 'Datos de prueba insertados - Total ~20 colaboradores';
COMMENT ON TABLE asistencias IS 'Asistencias generadas para los últimos 30 días laborables';
COMMENT ON TABLE datos_biometricos IS 'Datos biométricos simulados con embeddings aleatorios';

-- ============================================
-- VERIFICACIÓN DE DATOS INSERTADOS
-- ============================================
-- Para verificar los datos insertados, ejecutar:
-- SELECT COUNT(*) FROM colaboradores;
-- SELECT COUNT(*) FROM sedes;
-- SELECT COUNT(*) FROM asistencias;
-- SELECT COUNT(*) FROM datos_biometricos;
-- SELECT COUNT(*) FROM usuarios;

-- Verificar asistencias por colaborador:
-- SELECT c.nombres, c.apellidos, COUNT(a.id) as total_asistencias
-- FROM colaboradores c
-- LEFT JOIN asistencias a ON a.colaborador_id = c.id
-- GROUP BY c.id, c.nombres, c.apellidos
-- ORDER BY total_asistencias DESC;


-- ============================================
-- ASIGNAR TURNOS A COLABORADORES (1, 2 y 3)
-- ============================================

-- Turno 1 → Grupo 1 (SEDE-001)
UPDATE colaboradores SET turno_id = 1 WHERE dni IN (
                                                    '45678901', '45678902', '45678903', '45678904', '45678905'
    );

-- Turno 2 → Grupo 2 (SEDE-002)
UPDATE colaboradores SET turno_id = 2 WHERE dni IN (
                                                    '45678906', '45678907', '45678908', '45678909'
    );

-- Turno 2 → Grupo 3 (SEDE-003)
UPDATE colaboradores SET turno_id = 2 WHERE dni IN (
                                                    '45678910', '45678911', '45678912'
    );

-- Turno 3 → Grupo 4 (SEDE-004)
UPDATE colaboradores SET turno_id = 3 WHERE dni IN (
                                                    '45678913', '45678914', '45678915'
    );

-- Turno 3 → Grupo 5 (SEDE-005)
UPDATE colaboradores SET turno_id = 3 WHERE dni IN (
                                                    '45678916', '45678917', '45678918'
    );

-- Turno 3 → Grupo sin sede asignada
UPDATE colaboradores SET turno_id = 3 WHERE dni IN (
                                                    '45678919', '45678920'
    );


-- ============================================
-- INASISTENCIAS
-- ============================================

DO $$
DECLARE
r RECORD;
BEGIN
FOR r IN (
        SELECT c.id AS colaborador_id,
               c.sede_id
        FROM colaboradores c
        LEFT JOIN usuarios u ON u.colaborador_id = c.id
WHERE (u.rol NOT IN ('ADMIN', 'RRHH') OR u.id IS NULL)
  AND c.sede_id IS NOT NULL
    )
    LOOP
        -- Falta de ayer
        INSERT INTO asistencias (
            colaborador_id, sede_id, fecha, estado,
            hora_entrada, hora_salida, latitud_entrada, longitud_entrada,
            latitud_salida, longitud_salida,
            confianza_facial_entrada, confianza_facial_salida,
            imagen_entrada_path, imagen_salida_path,
            horas_trabajadas, observaciones,
            created_at, updated_at
        ) VALUES (
            r.colaborador_id, r.sede_id, CURRENT_DATE - 1, 'FALTA',
            NULL, NULL, NULL, NULL,
            NULL, NULL,
            NULL, NULL,
            NULL, NULL,
            NULL, 'Falta generada automáticamente',
            NOW(), NOW()
        );

        -- Falta hace 2 días
INSERT INTO asistencias (
    colaborador_id, sede_id, fecha, estado,
    hora_entrada, hora_salida, latitud_entrada, longitud_entrada,
    latitud_salida, longitud_salida,
    confianza_facial_entrada, confianza_facial_salida,
    imagen_entrada_path, imagen_salida_path,
    horas_trabajadas, observaciones,
    created_at, updated_at
) VALUES (
             r.colaborador_id, r.sede_id, CURRENT_DATE - 2, 'FALTA',
             NULL, NULL, NULL, NULL,
             NULL, NULL,
             NULL, NULL,
             NULL, NULL,
             NULL, 'Falta generada automáticamente',
             NOW(), NOW()
         );

-- Falta hace 3 días
INSERT INTO asistencias (
    colaborador_id, sede_id, fecha, estado,
    hora_entrada, hora_salida, latitud_entrada, longitud_entrada,
    latitud_salida, longitud_salida,
    confianza_facial_entrada, confianza_facial_salida,
    imagen_entrada_path, imagen_salida_path,
    horas_trabajadas, observaciones,
    created_at, updated_at
) VALUES (
             r.colaborador_id, r.sede_id, CURRENT_DATE - 3, 'FALTA',
             NULL, NULL, NULL, NULL,
             NULL, NULL,
             NULL, NULL,
             NULL, NULL,
             NULL, 'Falta generada automáticamente',
             NOW(), NOW()
         );
END LOOP;
END $$;

--ALTER TABLE asistencias
--ALTER COLUMN estado TYPE varchar(40);


