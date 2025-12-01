-- Verificar datos actuales del colaborador
SELECT c.id, c.nombres, c.apellidos, c.sede_id, s.nombre as sede_nombre
FROM colaboradores c
LEFT JOIN sedes s ON s.id = c.sede_id
WHERE c.dni = '45678901' OR c.email LIKE '%carlos.rodriguez%';

-- Obtener ID de la sede
SELECT id, codigo, nombre FROM sedes ORDER BY id LIMIT 1;

-- Asignar colaborador a la primera sede si no tiene una asignada
UPDATE colaboradores
SET sede_id = (SELECT id FROM sedes ORDER BY id LIMIT 1)
WHERE dni = '45678901' AND sede_id IS NULL;

-- Verificar actualización
SELECT c.id, c.nombres, c.apellidos, c.sede_id, s.nombre as sede_nombre
FROM colaboradores c
LEFT JOIN sedes s ON s.id = c.sede_id
WHERE c.dni = '45678901' OR c.email LIKE '%carlos.rodriguez%';
