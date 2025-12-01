package com.example.asistencia.util;

public class ValidationMessages {

    // Mensajes generales
    public static final String REQUIRED = "Este campo es obligatorio";
    public static final String INVALID_FORMAT = "El formato no es válido";

    // Email
    public static final String EMAIL_INVALID = "El correo electrónico no es válido";
    public static final String DUPLICATE_EMAIL = "Este correo electrónico ya está registrado";

    // DNI y RUC
    public static final String DNI_INVALID = "El DNI debe tener 8 dígitos";
    public static final String DNI_REQUIRED = "El DNI es obligatorio";
    public static final String DUPLICATE_DNI = "Este DNI ya está registrado";
    public static final String RUC_INVALID = "El RUC debe tener 11 dígitos";
    public static final String DUPLICATE_RUC = "Este RUC ya está registrado";

    // Password
    public static final String PASSWORD_MIN_LENGTH =
            "La contraseña debe tener al menos " + Constants.PASSWORD_MIN_LENGTH + " caracteres";
    public static final String PASSWORD_REQUIRED = "La contraseña es obligatoria";
    public static final String PASSWORD_MISMATCH = "Las contraseñas no coinciden";
    public static final String PASSWORD_CURRENT_INCORRECT = "La contraseña actual es incorrecta";

    // Radio/Geofence
    public static final String RADIUS_OUT_OF_RANGE =
            "El radio debe estar entre " + Constants.MIN_RADIUS_METERS +
                    " y " + Constants.MAX_RADIUS_METERS + " metros";
    public static final String COORDINATES_REQUIRED = "Las coordenadas son obligatorias";
    public static final String LATITUDE_INVALID = "La latitud debe estar entre -90 y 90";
    public static final String LONGITUDE_INVALID = "La longitud debe estar entre -180 y 180";

    // Reconocimiento facial
    public static final String FACE_NOT_DETECTED = "No se detectó ningún rostro en la imagen";
    public static final String POOR_LIGHTING = "Por favor mejora la iluminación";
    public static final String FACE_NOT_CENTERED = "El rostro no está centrado";
    public static final String LOW_CONFIDENCE = "No se pudo verificar tu identidad con suficiente confianza";
    public static final String BIOMETRIC_DATA_NOT_FOUND = "No tienes datos biométricos registrados";
    public static final String MAX_IMAGES_EXCEEDED =
            "Solo puedes registrar un máximo de " + Constants.MAX_FACE_IMAGES + " imágenes";

    // Geolocalización
    public static final String OUTSIDE_GEOFENCE = "Debes estar dentro del perímetro de la sede";
    public static final String LOCATION_REQUIRED = "La ubicación es obligatoria para marcar asistencia";

    // Asistencia
    public static final String NO_ENTRY_RECORDED = "No tienes entrada registrada para hoy";
    public static final String ALREADY_MARKED_TODAY = "Ya has marcado asistencia hoy";
    public static final String ALREADY_MARKED_EXIT = "Ya has marcado tu salida";
    public static final String INVALID_TIME_RANGE = "La hora de salida debe ser posterior a la hora de entrada";

    // Sede
    public static final String SEDE_NOT_FOUND = "Sede no encontrada";
    public static final String SEDE_INACTIVE = "La sede no está activa";
    public static final String DUPLICATE_SEDE_CODIGO = "El código de sede ya está registrado";

    // Colaborador
    public static final String COLABORADOR_NOT_FOUND = "Colaborador no encontrado";
    public static final String COLABORADOR_INACTIVE = "El colaborador no está activo";
    public static final String COLABORADOR_BLOCKED = "El colaborador está bloqueado";

    // Usuario
    public static final String USER_NOT_FOUND = "Usuario no encontrado";
    public static final String USER_INACTIVE = "El usuario no está activo";
    public static final String USER_BLOCKED = "El usuario está bloqueado";
    public static final String DUPLICATE_USERNAME = "El nombre de usuario ya está registrado";
    public static final String INVALID_CREDENTIALS = "Credenciales inválidas";

    // Archivos
    public static final String FILE_TOO_LARGE =
            "El archivo es muy grande. Tamaño máximo: " + Constants.MAX_FILE_SIZE_MB + "MB";
    public static final String INVALID_FILE_TYPE = "Tipo de archivo no permitido";
    public static final String FILE_UPLOAD_ERROR = "Error al subir el archivo";
    public static final String IMAGE_REQUIRED = "La imagen es obligatoria";
    public static final String INVALID_BASE64 = "El formato Base64 de la imagen no es válido";

    // Empresa
    public static final String EMPRESA_NOT_FOUND = "Empresa no encontrada";

    private ValidationMessages() {
        throw new IllegalStateException("Utility class");
    }
}