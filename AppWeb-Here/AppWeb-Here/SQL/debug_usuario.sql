-- Verificar usuario carlos.rodriguez
SELECT
    u.id as usuario_id,
    u.username,
    u.rol,
    u.colaborador_id,
    c.id as collab_id_real,
    c.dni,
    c.nombres,
    c.apellidos,
    c.activo as collab_activo,
    u.activo as usuario_activo
FROM usuarios u
LEFT JOIN colaboradores c ON c.id = u.colaborador_id
WHERE u.username = 'carlos.rodriguez';

-- Ver asistencias del colaborador
SELECT COUNT(*) as total_asistencias, colaborador_id
FROM asistencias
WHERE colaborador_id = (SELECT colaborador_id FROM usuarios WHERE username = 'carlos.rodriguez')
GROUP BY colaborador_id;

-- Ver todas las asistencias
SELECT COUNT(*) as total_asistencias_sistema
FROM asistencias;

-- Ver todos los colaboradores
SELECT COUNT(*) as total_colaboradores
FROM colaboradores;

-- Ver todas las sedes
SELECT id, codigo, nombre
FROM sedes
ORDER BY id;
