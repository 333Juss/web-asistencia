-- Verificar usuarios y sus colaboradores
SELECT
    u.id as usuario_id,
    u.username,
    u.rol,
    u.colaborador_id,
    COALESCE(c.dni, 'N/A') as dni,
    COALESCE(c.nombres, 'N/A') as nombres,
    COALESCE(c.apellidos, 'N/A') as apellidos
FROM usuarios u
LEFT JOIN colaboradores c ON c.id = u.colaborador_id
ORDER BY u.id;

-- Ver colaboradores SIN usuario
SELECT
    c.id,
    c.dni,
    c.nombres,
    c.apellidos,
    c.cargo,
    'SIN USUARIO' as estado
FROM colaboradores c
WHERE NOT EXISTS (
    SELECT 1 FROM usuarios u WHERE u.colaborador_id = c.id
);
