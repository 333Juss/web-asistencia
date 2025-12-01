package com.example.asistencia.exception;

public class FacialRecognitionException extends RuntimeException {

    public FacialRecognitionException(String message) {
        super(message);
    }

    public FacialRecognitionException(String message, Throwable cause) {
        super(message, cause);
    }
}
