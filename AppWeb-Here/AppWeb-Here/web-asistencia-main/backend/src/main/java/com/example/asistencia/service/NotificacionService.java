package com.example.asistencia.service;

public interface NotificacionService {

    // si quieres seguir con email
    void enviarEmail(String to, String subject, String body);

    // nuevo: por WhatsApp
    void enviarWhatsapp(String numero, String mensaje);
}
