-- Verificar rol de carlos.rodriguez
SELECT
    u.id,
    u.username,
    u.rol,
    u.activo,
    u.bloqueado,
    c.nombres,
    c.apellidos,
    c.cargo
FROM usuarios u
LEFT JOIN colaboradores c ON c.id = u.colaborador_id
WHERE u.username = 'carlos.rodriguez';

-- Verificar que el rol esté bien escrito
SELECT DISTINCT rol FROM usuarios;
