package com.example.asistencia.scheduler;

import com.example.asistencia.entity.Colaborador;
import com.example.asistencia.repository.ColaboradorRepository;
import com.example.asistencia.service.NotificacionService;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class TurnoNotificationScheduler {

    private final ColaboradorRepository colaboradorRepository;
    private final NotificacionService notificacionService;

    @Scheduled(cron = "0 * * * * *") // cada minuto
    public void enviarRecordatorios() {

        List<Colaborador> colaboradores = colaboradorRepository.findAll();
        LocalTime ahora = LocalTime.now();

        for (Colaborador col : colaboradores) {

            if (col.getTurno() == null) continue;
            if (col.getTelefono() == null || col.getTelefono().isBlank()) continue;

            LocalTime inicio = col.getTurno().getHoraInicio();

            // Momento exacto 15 minutos antes del turno
            LocalTime momentoRecordatorio = inicio.minusMinutes(15);

            if (momentoRecordatorio.getHour() == ahora.getHour() &&
                    momentoRecordatorio.getMinute() == ahora.getMinute()) {

                String mensaje = "Hola " + col.getNombres() +
                        ", tu turno (" + col.getTurno().getNombre() +
                        ") comienza en 15 minutos.";

                // Aquí usamos WhatsApp
                notificacionService.enviarWhatsapp(formatearNumero(col.getTelefono()), mensaje);
            }
        }
    }

    // Opcional: si quieres limpiar el formato en backend también
    private String formatearNumero(String tel) {
        // Asegúrate de guardar los teléfonos con código de país: ej. 51...
        return tel.replaceAll("[^0-9]", "");
    }
}
