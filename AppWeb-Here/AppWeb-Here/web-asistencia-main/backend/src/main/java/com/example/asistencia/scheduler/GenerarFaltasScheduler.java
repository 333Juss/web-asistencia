package com.example.asistencia.scheduler;

import com.example.asistencia.service.GeneradorFaltasService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Slf4j
@Component
@RequiredArgsConstructor
public class GenerarFaltasScheduler {

    private final GeneradorFaltasService generadorFaltasService;

    // Cada 10 minutos
    @Scheduled(cron = "0 */10 * * * ?")
    public void ejecutar() {
        generadorFaltasService.generarFaltas(LocalDate.now());
    }
}
