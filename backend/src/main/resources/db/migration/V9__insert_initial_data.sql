-- Insertar empresa de ejemplo
INSERT INTO empresas (ruc, razon_social, nombre_comercial, direccion, ciudad, departamento, activo)
VALUES
    ('20123456789', 'EMPRESA DEMO S.A.C.', 'Demo Corp', 'Av. Principal 123', 'Lima', 'Lima', TRUE);

-- Insertar sede de ejemplo
INSERT INTO sedes (empresa_id, codigo, nombre, direccion, distrito, provincia, departamento, latitud, longitud, radio_metros, activo)
VALUES
    (1, 'SEDE-001', 'Oficina Central', 'Av. Principal 123', 'San Isidro', 'Lima', 'Lima', -12.0897100, -77.0343800, 50, TRUE);

-- Insertar colaborador administrador
INSERT INTO colaboradores (empresa_id, sede_id, dni, nombres, apellidos, email, telefono, fecha_ingreso, cargo, tiene_datos_biometricos, activo)
VALUES
    (1, 1, '12345678', 'Admin', 'Sistema', 'admin@asistencia.com', '999999999', CURRENT_DATE, 'Administrador', FALSE, TRUE);

-- Insertar usuario administrador
-- Password: admin123 (encriptado con BCrypt)
-- Para generar: usar BCryptPasswordEncoder en Spring Boot
INSERT INTO usuarios (colaborador_id, username, password, rol, activo)
VALUES
    (1, 'admin', '$2a$10$YourBCryptHashHere', 'ADMIN', TRUE);

-- Nota: Debes reemplazar '$2a$10$YourBCryptHashHere' con un hash BCrypt real
-- Puedes generarlo ejecutando este código Java:
-- BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
-- String hashedPassword = encoder.encode("admin123");

-- Comentarios
COMMENT ON TABLE empresas IS 'Usuario admin creado con password: admin123';
COMMENT ON TABLE usuarios IS 'Usuario: admin | Password: admin123';