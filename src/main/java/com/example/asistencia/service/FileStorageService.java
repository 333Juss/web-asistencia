package com.example.asistencia.service;
import com.example.asistencia.exception.FileStorageException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.biometric-dir:./uploads/biometric}")
    private String biometricDir;

    @Value("${file.attendance-dir:./uploads/attendance}")
    private String attendanceDir;

    /**
     * Guarda una imagen biométrica desde Base64
     */
    public String saveBiometricImage(String base64Image, Long colaboradorId) {
        try {
            // Crear directorio si no existe
            Path uploadPath = Paths.get(biometricDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Decodificar Base64
            byte[] imageBytes = decodeBase64Image(base64Image);

            // Generar nombre único para el archivo
            String fileName = generateBiometricFileName(colaboradorId);
            Path filePath = uploadPath.resolve(fileName);

            // Guardar archivo
            Files.write(filePath, imageBytes);

            return fileName;
        } catch (IOException e) {
            throw new FileStorageException("Error al guardar imagen biométrica: " + e.getMessage());
        }
    }

    /**
     * Guarda una imagen de asistencia desde Base64
     */
    public String saveAttendanceImage(String base64Image, Long colaboradorId, String tipo) {
        try {
            // Crear directorio si no existe
            Path uploadPath = Paths.get(attendanceDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Decodificar Base64
            byte[] imageBytes = decodeBase64Image(base64Image);

            // Generar nombre único para el archivo
            String fileName = generateAttendanceFileName(colaboradorId, tipo);
            Path filePath = uploadPath.resolve(fileName);

            // Guardar archivo
            Files.write(filePath, imageBytes);

            return fileName;
        } catch (IOException e) {
            throw new FileStorageException("Error al guardar imagen de asistencia: " + e.getMessage());
        }
    }

    /**
     * Lee una imagen y la retorna como byte array
     */
    public byte[] readImage(String fileName, String directory) {
        try {
            Path filePath = Paths.get(directory).resolve(fileName);
            if (!Files.exists(filePath)) {
                throw new FileStorageException("Archivo no encontrado: " + fileName);
            }
            return Files.readAllBytes(filePath);
        } catch (IOException e) {
            throw new FileStorageException("Error al leer imagen: " + e.getMessage());
        }
    }

    /**
     * Elimina una imagen
     */
    public void deleteImage(String fileName, String directory) {
        try {
            Path filePath = Paths.get(directory).resolve(fileName);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new FileStorageException("Error al eliminar imagen: " + e.getMessage());
        }
    }

    /**
     * Decodifica una imagen Base64
     */
    private byte[] decodeBase64Image(String base64Image) {
        try {
            // Remover prefijo "data:image/..." si existe
            String base64Data = base64Image;
            if (base64Image.contains(",")) {
                base64Data = base64Image.split(",")[1];
            }
            return Base64.getDecoder().decode(base64Data);
        } catch (IllegalArgumentException e) {
            throw new FileStorageException("Formato Base64 inválido");
        }
    }

    /**
     * Genera un nombre único para imagen biométrica
     */
    private String generateBiometricFileName(Long colaboradorId) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String uuid = UUID.randomUUID().toString().substring(0, 8);
        return String.format("bio_%d_%s_%s.jpg", colaboradorId, timestamp, uuid);
    }

    /**
     * Genera un nombre único para imagen de asistencia
     */
    private String generateAttendanceFileName(Long colaboradorId, String tipo) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String uuid = UUID.randomUUID().toString().substring(0, 8);
        return String.format("att_%s_%d_%s_%s.jpg", tipo, colaboradorId, timestamp, uuid);
    }

    /**
     * Valida el tamaño de la imagen
     */
    public boolean validateImageSize(byte[] imageBytes, long maxSizeMB) {
        long maxSizeBytes = maxSizeMB * 1024 * 1024;
        return imageBytes.length <= maxSizeBytes;
    }

    public String getBiometricDir() {
        return biometricDir;
    }

    public String getAttendanceDir() {
        return attendanceDir;
    }
}
