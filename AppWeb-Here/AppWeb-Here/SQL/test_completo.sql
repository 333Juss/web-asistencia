-- Test completo del sistema

-- 1. Usuario carlos.rodriguez
SELECT '=== USUARIO CARLOS.RODRIGUEZ ===' as info;
SELECT u.id, u.username, u.rol, u.activo, u.bloqueado, u.colaborador_id,
       c.nombres, c.apellidos, c.email, c.cargo
FROM usuarios u
LEFT JOIN colaboradores c ON c.id = u.colaborador_id
WHERE u.username = 'carlos.rodriguez';

-- 2. Total de datos en el sistema
SELECT '=== TOTALES DEL SISTEMA ===' as info;
SELECT
    (SELECT COUNT(*) FROM colaboradores WHERE activo = true) as colaboradores_activos,
    (SELECT COUNT(*) FROM sedes WHERE activo = true) as sedes_activas,
    (SELECT COUNT(*) FROM asistencias) as total_asistencias,
    (SELECT COUNT(*) FROM usuarios WHERE activo = true) as usuarios_activos;

-- 3. Asistencias del colaborador Carlos
SELECT '=== ASISTENCIAS DE CARLOS ===' as info;
SELECT COUNT(*) as asistencias_carlos
FROM asistencias a
JOIN colaboradores c ON c.id = a.colaborador_id
JOIN usuarios u ON u.colaborador_id = c.id
WHERE u.username = 'carlos.rodriguez';

-- 4. Primeras 5 asistencias de cualquier colaborador (para verificar que existen)
SELECT '=== PRIMERAS 5 ASISTENCIAS ===' as info;
SELECT c.nombres, c.apellidos, a.fecha, a.hora_entrada, a.hora_salida, a.estado
FROM asistencias a
JOIN colaboradores c ON c.id = a.colaborador_id
ORDER BY a.fecha DESC
LIMIT 5;

-- 5. Todos los usuarios creados
SELECT '=== TODOS LOS USUARIOS ===' as info;
SELECT u.username, u.rol, c.nombres, c.apellidos
FROM usuarios u
LEFT JOIN colaboradores c ON c.id = u.colaborador_id
ORDER BY u.id;
