-- Crear usuario RRHH
INSERT INTO usuario (username, email, password, rol, activo, created_at, updated_at)
VALUES ('rrhh', 'rrhh@here.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'RRHH', true, NOW(), NOW());

-- Crear usuario EMPLEADO
INSERT INTO usuario (username, email, password, rol, activo, created_at, updated_at)
VALUES ('empleado', 'empleado@here.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'EMPLEADO', true, NOW(), NOW());

-- Crear usuario SUPERVISOR
INSERT INTO usuario (username, email, password, rol, activo, created_at, updated_at)
VALUES ('supervisor', 'supervisor@here.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'SUPERVISOR', true, NOW(), NOW());
