-- ============================================
-- CREAR USUARIOS PARA TODOS LOS COLABORADORES
-- ============================================
-- Password para todos: "password123"
-- Hash: $2a$12$B4fjZxhy.Hulpp4RkA9Mdexau7ly8/VZzMkb7OhfwpsRo13VVLyCi

-- Eliminar usuarios duplicados o con problemas (excepto admin)
DELETE FROM usuarios WHERE username != 'admin' AND colaborador_id IS NOT NULL;

-- Crear usuarios para cada colaborador (SIN TILDES en username)
-- Sede Central
INSERT INTO usuarios (colaborador_id, username, password, rol, activo)
SELECT id, 'carlos.rodriguez', '$2a$12$B4fjZxhy.Hulpp4RkA9Mdexau7ly8/VZzMkb7OhfwpsRo13VVLyCi', 'ADMIN', TRUE
FROM colaboradores WHERE dni = '45678901'
ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password;

INSERT INTO usuarios (colaborador_id, username, password, rol, activo)
SELECT id, 'maria.lopez', '$2a$12$B4fjZxhy.Hulpp4RkA9Mdexau7ly8/VZzMkb7OhfwpsRo13VVLyCi', 'RRHH', TRUE
FROM colaboradores WHERE dni = '45678902'
ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password, colaborador_id = EXCLUDED.colaborador_id;

INSERT INTO usuarios (colaborador_id, username, password, rol, activo)
SELECT id, 'jose.martinez', '$2a$12$B4fjZxhy.Hulpp4RkA9Mdexau7ly8/VZzMkb7OhfwpsRo13VVLyCi', 'EMPLEADO', TRUE
FROM colaboradores WHERE dni = '45678903'
ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password, colaborador_id = EXCLUDED.colaborador_id;

INSERT INTO usuarios (colaborador_id, username, password, rol, activo)
SELECT id, 'ana.garcia', '$2a$12$B4fjZxhy.Hulpp4RkA9Mdexau7ly8/VZzMkb7OhfwposRo13VVLyCi', 'EMPLEADO', TRUE
FROM colaboradores WHERE dni = '45678904'
ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password, colaborador_id = EXCLUDED.colaborador_id;

INSERT INTO usuarios (colaborador_id, username, password, rol, activo)
SELECT id, 'luis.perez', '$2a$12$B4fjZxhy.Hulpp4RkA9Mdexau7ly8/VZzMkb7OhfwpsRo13VVLyCi', 'EMPLEADO', TRUE
FROM colaboradores WHERE dni = '45678905'
ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password, colaborador_id = EXCLUDED.colaborador_id;

-- Sede Miraflores
INSERT INTO usuarios (colaborador_id, username, password, rol, activo)
SELECT id, 'carmen.vega', '$2a$12$B4fjZxhy.Hulpp4RkA9Mdexau7ly8/VZzMkb7OhfwpsRo13VVLyCi', 'SUPERVISOR', TRUE
FROM colaboradores WHERE dni = '45678906'
ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password, colaborador_id = EXCLUDED.colaborador_id;

INSERT INTO usuarios (colaborador_id, username, password, rol, activo)
SELECT id, 'roberto.flores', '$2a$12$B4fjZxhy.Hulpp4RkA9Mdexau7ly8/VZzMkb7OhfwpsRo13VVLyCi', 'EMPLEADO', TRUE
FROM colaboradores WHERE dni = '45678907'
ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password, colaborador_id = EXCLUDED.colaborador_id;

INSERT INTO usuarios (colaborador_id, username, password, rol, activo)
SELECT id, 'patricia.diaz', '$2a$12$B4fjZxhy.Hulpp4RkA9Mdexau7ly8/VZzMkb7OhfwpsRo13VVLyCi', 'EMPLEADO', TRUE
FROM colaboradores WHERE dni = '45678908'
ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password, colaborador_id = EXCLUDED.colaborador_id;

INSERT INTO usuarios (colaborador_id, username, password, rol, activo)
SELECT id, 'fernando.rojas', '$2a$12$B4fjZxhy.Hulpp4RkA9Mdexau7ly8/VZzMkb7OhfwpsRo13VVLyCi', 'EMPLEADO', TRUE
FROM colaboradores WHERE dni = '45678909'
ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password, colaborador_id = EXCLUDED.colaborador_id;

-- Sede San Miguel
INSERT INTO usuarios (colaborador_id, username, password, rol, activo)
SELECT id, 'isabel.campos', '$2a$12$B4fjZxhy.Hulpp4RkA9Mdexau7ly8/VZzMkb7OhfwpsRo13VVLyCi', 'RRHH', TRUE
FROM colaboradores WHERE dni = '45678910'
ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password, colaborador_id = EXCLUDED.colaborador_id;

INSERT INTO usuarios (colaborador_id, username, password, rol, activo)
SELECT id, 'miguel.herrera', '$2a$12$B4fjZxhy.Hulpp4RkA9Mdexau7ly8/VZzMkb7OhfwpsRo13VVLyCi', 'EMPLEADO', TRUE
FROM colaboradores WHERE dni = '45678911'
ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password, colaborador_id = EXCLUDED.colaborador_id;

INSERT INTO usuarios (colaborador_id, username, password, rol, activo)
SELECT id, 'laura.cruz', '$2a$12$B4fjZxhy.Hulpp4RkA9Mdexau7ly8/VZzMkb7OhfwpsRo13VVLyCi', 'EMPLEADO', TRUE
FROM colaboradores WHERE dni = '45678912'
ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password, colaborador_id = EXCLUDED.colaborador_id;

-- Sede Surco
INSERT INTO usuarios (colaborador_id, username, password, rol, activo)
SELECT id, 'diego.reyes', '$2a$12$B4fjZxhy.Hulpp4RkA9Mdexau7ly8/VZzMkb7OhfwpsRo13VVLyCi', 'RRHH', TRUE
FROM colaboradores WHERE dni = '45678913'
ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password, colaborador_id = EXCLUDED.colaborador_id;

INSERT INTO usuarios (colaborador_id, username, password, rol, activo)
SELECT id, 'sofia.mendoza', '$2a$12$B4fjZxhy.Hulpp4RkA9Mdexau7ly8/VZzMkb7OhfwpsRo13VVLyCi', 'SUPERVISOR', TRUE
FROM colaboradores WHERE dni = '45678914'
ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password, colaborador_id = EXCLUDED.colaborador_id;

INSERT INTO usuarios (colaborador_id, username, password, rol, activo)
SELECT id, 'ricardo.salazar', '$2a$12$B4fjZxhy.Hulpp4RkA9Mdexau7ly8/VZzMkb7OhfwpsRo13VVLyCi', 'EMPLEADO', TRUE
FROM colaboradores WHERE dni = '45678915'
ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password, colaborador_id = EXCLUDED.colaborador_id;

-- Sede Los Olivos
INSERT INTO usuarios (colaborador_id, username, password, rol, activo)
SELECT id, 'gabriela.navarro', '$2a$12$B4fjZxhy.Hulpp4RkA9Mdexau7ly8/VZzMkb7OhfwpsRo13VVLyCi', 'RRHH', TRUE
FROM colaboradores WHERE dni = '45678916'
ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password, colaborador_id = EXCLUDED.colaborador_id;

INSERT INTO usuarios (colaborador_id, username, password, rol, activo)
SELECT id, 'andres.paredes', '$2a$12$B4fjZxhy.Hulpp4RkA9Mdexau7ly8/VZzMkb7OhfwpsRo13VVLyCi', 'EMPLEADO', TRUE
FROM colaboradores WHERE dni = '45678917'
ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password, colaborador_id = EXCLUDED.colaborador_id;

INSERT INTO usuarios (colaborador_id, username, password, rol, activo)
SELECT id, 'valeria.quispe', '$2a$12$B4fjZxhy.Hulpp4RkA9Mdexau7ly8/VZzMkb7OhfwpsRo13VVLyCi', 'EMPLEADO', TRUE
FROM colaboradores WHERE dni = '45678918'
ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password, colaborador_id = EXCLUDED.colaborador_id;

-- Sin sede
INSERT INTO usuarios (colaborador_id, username, password, rol, activo)
SELECT id, 'javier.morales', '$2a$12$B4fjZxhy.Hulpp4RkA9Mdexau7ly8/VZzMkb7OhfwpsRo13VVLyCi', 'EMPLEADO', TRUE
FROM colaboradores WHERE dni = '45678919'
ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password, colaborador_id = EXCLUDED.colaborador_id;

INSERT INTO usuarios (colaborador_id, username, password, rol, activo)
SELECT id, 'claudia.fernandez', '$2a$12$B4fjZxhy.Hulpp4RkA9Mdexau7ly8/VZzMkb7OhfwpsRo13VVLyCi', 'EMPLEADO', TRUE
FROM colaboradores WHERE dni = '45678920'
ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password, colaborador_id = EXCLUDED.colaborador_id;

-- Verificar resultado
SELECT
    '=== USUARIOS CREADOS ===' as info;

SELECT
    u.id,
    u.username,
    u.rol,
    c.nombres,
    c.apellidos,
    c.cargo,
    s.nombre as sede
FROM usuarios u
LEFT JOIN colaboradores c ON c.id = u.colaborador_id
LEFT JOIN sedes s ON s.id = c.sede_id
ORDER BY u.username;

-- Estadísticas
SELECT
    '=== ESTADÍSTICAS ===' as info;

SELECT
    COUNT(*) as total_usuarios,
    COUNT(CASE WHEN rol = 'ADMIN' THEN 1 END) as admins,
    COUNT(CASE WHEN rol = 'RRHH' THEN 1 END) as rrhh,
    COUNT(CASE WHEN rol = 'SUPERVISOR' THEN 1 END) as supervisores,
    COUNT(CASE WHEN rol = 'EMPLEADO' THEN 1 END) as empleados
FROM usuarios;
