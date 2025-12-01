-- ============================================
-- FIX: Actualizar contraseñas de usuarios
-- ============================================
-- Password: "admin123"
-- Hash BCrypt correcto: $2a$10$YkxDT6p5L3hH8VvQKzqXxuR2h9dGZqVQmKF5z7vPqnZJ6nU0K4Mvm

-- Opción 1: Actualizar todos los usuarios con la misma contraseña temporal
UPDATE usuarios
SET password = '$2a$10$YkxDT6p5L3hH8VvQKzqXxuR2h9dGZqVQmKF5z7vPqnZJ6nU0K4Mvm'
WHERE activo = true;

-- Ver resultado
SELECT id, username, rol,
       CASE WHEN password = '$2a$10$YkxDT6p5L3hH8VvQKzqXxuR2h9dGZqVQmKF5z7vPqnZJ6nU0K4Mvm'
            THEN 'ACTUALIZADO'
            ELSE 'NO ACTUALIZADO'
       END as estado
FROM usuarios
ORDER BY id;
