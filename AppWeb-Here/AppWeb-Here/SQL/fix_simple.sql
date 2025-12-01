-- Script simple para crear usuarios principales
-- Password: password123
-- Hash: $2a$12$B4fjZxhy.Hulpp4RkA9Mdexau7ly8/VZzMkb7OhfwpsRo13VVLyCi

-- Borrar usuarios problemáticos (mantener solo admin)
DELETE FROM usuarios WHERE id > 1;

-- Usuario 1: Carlos (ADMIN)
INSERT INTO usuarios (colaborador_id, username, password, rol, activo)
SELECT id, 'carlos.rodriguez', '$2a$12$B4fjZxhy.Hulpp4RkA9Mdexau7ly8/VZzMkb7OhfwpsRo13VVLyCi', 'ADMIN', TRUE
FROM colaboradores WHERE dni = '45678901';

-- Usuario 2: María (RRHH)
INSERT INTO usuarios (colaborador_id, username, password, rol, activo)
SELECT id, 'maria.lopez', '$2a$12$B4fjZxhy.Hulpp4RkA9Mdexau7ly8/VZzMkb7OhfwpsRo13VVLyCi', 'RRHH', TRUE
FROM colaboradores WHERE dni = '45678902';

-- Usuario 3: José (EMPLEADO)
INSERT INTO usuarios (colaborador_id, username, password, rol, activo)
SELECT id, 'jose.martinez', '$2a$12$B4fjZxhy.Hulpp4RkA9Mdexau7ly8/VZzMkb7OhfwpsRo13VVLyCi', 'EMPLEADO', TRUE
FROM colaboradores WHERE dni = '45678903';

-- Usuario 4: Ana (EMPLEADO)
INSERT INTO usuarios (colaborador_id, username, password, rol, activo)
SELECT id, 'ana.garcia', '$2a$12$B4fjZxhy.Hulpp4RkA9Mdexau7ly8/VZzMkb7OhfwpsRo13VVLyCi', 'EMPLEADO', TRUE
FROM colaboradores WHERE dni = '45678904';

-- Usuario 5: Luis (EMPLEADO)
INSERT INTO usuarios (colaborador_id, username, password, rol, activo)
SELECT id, 'luis.perez', '$2a$12$B4fjZxhy.Hulpp4RkA9Mdexau7ly8/VZzMkb7OhfwpsRo13VVLyCi', 'EMPLEADO', TRUE
FROM colaboradores WHERE dni = '45678905';

-- Ver resultado
SELECT u.username, u.rol, c.nombres, c.apellidos
FROM usuarios u
LEFT JOIN colaboradores c ON c.id = u.colaborador_id
ORDER BY u.id;
