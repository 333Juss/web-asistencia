-- Asignar el colaborador Carlos al usuario admin
UPDATE usuarios
SET colaborador_id = (SELECT id FROM colaboradores WHERE dni = '45678901'),
    rol = 'ADMIN'
WHERE username = 'admin';

-- Verificar
SELECT u.username, u.rol, c.nombres, c.apellidos, c.email
FROM usuarios u
LEFT JOIN colaboradores c ON c.id = u.colaborador_id
WHERE u.username = 'admin';

-- Contar asistencias del admin (ahora debería tener)
SELECT COUNT(*) as asistencias_admin
FROM asistencias
WHERE colaborador_id = (SELECT colaborador_id FROM usuarios WHERE username = 'admin');
