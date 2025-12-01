-- Script para verificar datos en la base de datos

-- 1. Contar registros totales
SELECT
    'TOTALES' as tipo,
    (SELECT COUNT(*) FROM colaboradores) as colaboradores,
    (SELECT COUNT(*) FROM sedes) as sedes,
    (SELECT COUNT(*) FROM asistencias) as asistencias,
    (SELECT COUNT(*) FROM datos_biometricos) as biometricos,
    (SELECT COUNT(*) FROM usuarios) as usuarios;

-- 2. Ver usuarios creados
SELECT
    '--- USUARIOS ---' as info;
SELECT u.id, u.username, u.rol, c.nombres, c.apellidos, u.activo
FROM usuarios u
LEFT JOIN colaboradores c ON c.id = u.colaborador_id
ORDER BY u.id;

-- 3. Ver colaboradores
SELECT
    '--- COLABORADORES ---' as info;
SELECT c.id, c.dni, c.nombres, c.apellidos, c.cargo, s.nombre as sede, c.tiene_datos_biometricos
FROM colaboradores c
LEFT JOIN sedes s ON s.id = c.sede_id
ORDER BY c.id
LIMIT 10;

-- 4. Ver sedes
SELECT
    '--- SEDES ---' as info;
SELECT id, codigo, nombre, distrito
FROM sedes
ORDER BY id;

-- 5. Ver asistencias recientes
SELECT
    '--- ASISTENCIAS (últimas 10) ---' as info;
SELECT c.nombres, c.apellidos, a.fecha, a.hora_entrada, a.hora_salida,
       a.horas_trabajadas, a.estado
FROM asistencias a
JOIN colaboradores c ON c.id = a.colaborador_id
ORDER BY a.fecha DESC, a.hora_entrada DESC
LIMIT 10;

-- 6. Verificar si hay asistencias para colaboradores específicos
SELECT
    '--- ASISTENCIAS POR COLABORADOR ---' as info;
SELECT c.nombres, c.apellidos, COUNT(a.id) as total_asistencias
FROM colaboradores c
LEFT JOIN asistencias a ON a.colaborador_id = c.id
GROUP BY c.id, c.nombres, c.apellidos
ORDER BY total_asistencias DESC;
