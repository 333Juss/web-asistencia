package com.example.asistencia.util;

import java.util.Base64;
import java.util.regex.Pattern;

public class ImageUtils {

    private static final Pattern BASE64_PATTERN = Pattern.compile("^data:image/(jpeg|jpg|png);base64,(.+)$");
    private static final long MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
    private static final int MIN_WIDTH = 200;
    private static final int MIN_HEIGHT = 200;

    /**
     * Valida que una cadena Base64 sea válida
     */
    public static boolean isValidBase64Image(String base64Image) {
        if (base64Image == null || base64Image.isEmpty()) {
            return false;
        }

        try {
            // Verificar formato
            if (base64Image.startsWith("data:image/")) {
                if (!BASE64_PATTERN.matcher(base64Image).matches()) {
                    return false;
                }
            }

            // Intentar decodificar
            String base64Data = base64Image.contains(",")
                    ? base64Image.split(",")[1]
                    : base64Image;

            byte[] decoded = Base64.getDecoder().decode(base64Data);

            // Verificar tamaño
            return decoded.length > 0 && decoded.length <= MAX_SIZE_BYTES;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    /**
     * Extrae los bytes de una imagen Base64
     */
    public static byte[] extractBytes(String base64Image) {
        String base64Data = base64Image.contains(",")
                ? base64Image.split(",")[1]
                : base64Image;
        return Base64.getDecoder().decode(base64Data);
    }

    /**
     * Calcula el tamaño estimado en KB
     */
    public static double estimateSizeKB(String base64Image) {
        byte[] bytes = extractBytes(base64Image);
        return bytes.length / 1024.0;
    }

    /**
     * Valida el tipo MIME de la imagen
     */
    public static boolean isValidImageType(String base64Image) {
        if (!base64Image.startsWith("data:image/")) {
            return true; // Asumir válido si no tiene prefijo
        }

        return base64Image.startsWith("data:image/jpeg") ||
                base64Image.startsWith("data:image/jpg") ||
                base64Image.startsWith("data:image/png");
    }

    /**
     * Limpia el prefijo data:image/... de la cadena Base64
     */
    public static String cleanBase64(String base64Image) {
        if (base64Image.contains(",")) {
            return base64Image.split(",")[1];
        }
        return base64Image;
    }

    private ImageUtils() {
        throw new IllegalStateException("Utility class");
    }
}
