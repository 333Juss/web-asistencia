-- Reparar Flyway: actualizar el checksum de la migración V12
UPDATE flyway_schema_history
SET checksum = NULL
WHERE version = '12';

-- O borrar la entrada y dejar que se vuelva a ejecutar
-- DELETE FROM flyway_schema_history WHERE version = '12';

-- Verificar
SELECT version, description, checksum, success, installed_on
FROM flyway_schema_history
ORDER BY installed_rank DESC;
