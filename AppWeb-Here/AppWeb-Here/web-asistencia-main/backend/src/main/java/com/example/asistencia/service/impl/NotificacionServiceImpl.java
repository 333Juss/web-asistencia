package com.example.asistencia.service.impl;

import com.example.asistencia.service.NotificacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class NotificacionServiceImpl implements NotificacionService {

    // URL del microservicio de WhatsApp
    @Value("${whatsapp.api.url:http://localhost:3001}")
    private String whatsappApiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public void enviarEmail(String to, String subject, String body) {
        // si quieres algo luego aquí, por ahora solo log
        System.out.println("📧 [FAKE EMAIL] a " + to + " - " + subject + " - " + body);
    }

    @Override
    public void enviarWhatsapp(String numero, String mensaje) {
        try {
            String url = whatsappApiUrl + "/send";

            Map<String, String> body = new HashMap<>();
            body.put("numero", numero);
            body.put("mensaje", mensaje);

            restTemplate.postForObject(url, body, String.class);
            System.out.println("📲 WhatsApp enviado a " + numero + ": " + mensaje);
        } catch (Exception e) {
            System.err.println("❌ Error enviando WhatsApp a " + numero + ": " + e.getMessage());
        }
    }
}
