-- Ver todos los usernames exactos
SELECT id, username, rol, activo,
       encode(username::bytea, 'hex') as username_hex
FROM usuarios
ORDER BY id;
