-- ============================================
-- ACTUALIZAR PASSWORDS DE TODOS LOS USUARIOS
-- ============================================
-- Password: "password123"
-- Hash: $2a$12$B4fjZxhy.Hulpp4RkA9Mdexau7ly8/VZzMkb7OhfwpsRo13VVLyCi

-- 1. Actualizar todos los usuarios existentes con password123
UPDATE usuarios
SET password = '$2a$12$B4fjZxhy.Hulpp4RkA9Mdexau7ly8/VZzMkb7OhfwpsRo13VVLyCi'
WHERE activo = true;

-- 2. Actualizar usernames para quitar tildes de los usuarios ya creados
UPDATE usuarios
SET username = LOWER(
    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
        username, 'á', 'a'), 'é', 'e'), 'í', 'i'), 'ó', 'o'), 'ú', 'u')
)
WHERE username ~ '[áéíóúÁÉÍÓÚ]';

-- 3. Verificar resultado
SELECT
    u.id,
    u.username,
    u.rol,
    c.nombres,
    c.apellidos,
    u.activo,
    CASE
        WHEN u.password = '$2a$12$B4fjZxhy.Hulpp4RkA9Mdexau7ly8/VZzMkb7OhfwpsRo13VVLyCi'
        THEN '✓ Correcto (password123)'
        ELSE '✗ Incorrecto'
    END as password_status
FROM usuarios u
LEFT JOIN colaboradores c ON c.id = u.colaborador_id
ORDER BY u.id;

-- 4. Mensaje de confirmación
SELECT
    COUNT(*) as total_usuarios_actualizados,
    'Todos los usuarios ahora tienen password: password123' as mensaje
FROM usuarios
WHERE password = '$2a$12$B4fjZxhy.Hulpp4RkA9Mdexau7ly8/VZzMkb7OhfwpsRo13VVLyCi';
