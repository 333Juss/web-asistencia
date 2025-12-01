 -- Crear usuario RRHH (contraseña: 123456)
  INSERT INTO usuarios (username, password, rol, activo, created_at, updated_at)
  VALUES ('rrhh', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'RRHH', true, NOW(), NOW());

  -- Crear usuario EMPLEADO (contraseña: 123456)
  INSERT INTO usuarios (username, password, rol, activo, created_at, updated_at)
  VALUES ('empleado', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'EMPLEADO', true, NOW(), NOW());

  -- Crear usuario SUPERVISOR (contraseña: 123456)
  INSERT INTO usuarios (username, password, rol, activo, created_at, updated_at)
  VALUES ('supervisor', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'SUPERVISOR', true, NOW(), NOW());