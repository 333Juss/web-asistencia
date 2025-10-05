export const APP_CONSTANTS = {
    MIN_RADIUS_METERS: 20,
    MAX_RADIUS_METERS: 200,
    DEFAULT_RADIUS_METERS: 50,

    MIN_FACE_CONFIDENCE: 0.85,
    MAX_FACE_IMAGES: 5,

    DNI_LENGTH: 8,
    RUC_LENGTH: 11,

    PASSWORD_MIN_LENGTH: 8,

    DATE_FORMAT: 'DD/MM/YYYY',
    TIME_FORMAT: 'HH:mm',
    DATETIME_FORMAT: 'DD/MM/YYYY HH:mm',

    MAX_FILE_SIZE_MB: 5,
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png'],

    SESSION_TIMEOUT_MINUTES: 60,
    TOKEN_REFRESH_THRESHOLD_MINUTES: 10
};

export const VALIDATION_MESSAGES = {
    REQUIRED: 'Este campo es obligatorio',
    EMAIL_INVALID: 'El correo electrónico no es válido',
    DNI_INVALID: 'El DNI debe tener 8 dígitos',
    RUC_INVALID: 'El RUC debe tener 11 dígitos',
    PASSWORD_MIN_LENGTH: `La contraseña debe tener al menos ${APP_CONSTANTS.PASSWORD_MIN_LENGTH} caracteres`,
    RADIUS_OUT_OF_RANGE: `El radio debe estar entre ${APP_CONSTANTS.MIN_RADIUS_METERS} y ${APP_CONSTANTS.MAX_RADIUS_METERS} metros`,
    DUPLICATE_DNI: 'Este DNI ya está registrado',
    DUPLICATE_EMAIL: 'Este correo electrónico ya está registrado',
    DUPLICATE_RUC: 'Este RUC ya está registrado',
    FACE_NOT_DETECTED: 'No se detectó ningún rostro en la imagen',
    POOR_LIGHTING: 'Por favor mejora la iluminación',
    FACE_NOT_CENTERED: 'El rostro no está centrado',
    LOW_CONFIDENCE: 'No se pudo verificar tu identidad con suficiente confianza',
    OUTSIDE_GEOFENCE: 'Debes estar dentro del perímetro de la tienda',
    NO_ENTRY_RECORDED: 'No tienes entrada registrada',
    ALREADY_MARKED_TODAY: 'Ya has marcado asistencia hoy'
};