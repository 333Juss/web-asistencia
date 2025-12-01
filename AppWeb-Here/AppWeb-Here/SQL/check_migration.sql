-- Ver el estado de las migraciones de Flyway
SELECT version, description, type, script, installed_on, execution_time, success
FROM flyway_schema_history
ORDER BY installed_rank DESC
LIMIT 5;
