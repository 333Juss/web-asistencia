package com.example.asistencia.util;

public class Constants {

    // Geofence
    public static final int MIN_RADIUS_METERS = 20;
    public static final int MAX_RADIUS_METERS = 200;
    public static final int DEFAULT_RADIUS_METERS = 50;

    // Facial Recognition
    public static final double MIN_FACE_CONFIDENCE = 0.85;
    public static final int MAX_FACE_IMAGES = 5;

    // DNI y RUC
    public static final int DNI_LENGTH = 8;
    public static final int RUC_LENGTH = 11;

    // Password
    public static final int PASSWORD_MIN_LENGTH = 8;

    // Formatos de fecha
    public static final String DATE_FORMAT = "dd/MM/yyyy";
    public static final String TIME_FORMAT = "HH:mm";
    public static final String DATETIME_FORMAT = "dd/MM/yyyy HH:mm";

    // Archivos
    public static final long MAX_FILE_SIZE_MB = 5;
    public static final String[] ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/jpg", "image/png"};

    // Sesión
    public static final int SESSION_TIMEOUT_MINUTES = 60;
    public static final int TOKEN_REFRESH_THRESHOLD_MINUTES = 10;

    // Roles
    public static final String ROLE_ADMIN = "ADMIN";
    public static final String ROLE_RRHH = "RRHH";
    public static final String ROLE_EMPLEADO = "EMPLEADO";
    public static final String ROLE_SUPERVISOR = "SUPERVISOR";

    // API Base Path
    public static final String API_BASE_PATH = "/api";

    // Paginación
    public static final int DEFAULT_PAGE_SIZE = 10;
    public static final int MAX_PAGE_SIZE = 100;
    public static final String DEFAULT_SORT_FIELD = "id";
    public static final String DEFAULT_SORT_DIRECTION = "ASC";

    private Constants() {
        throw new IllegalStateException("Utility class");
    }
}