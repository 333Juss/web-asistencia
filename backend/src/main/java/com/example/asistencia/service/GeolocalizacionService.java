package com.example.asistencia.service;
import com.example.asistencia.entity.Sede;
import org.springframework.stereotype.Service;

@Service
public class GeolocalizacionService {

    private static final double EARTH_RADIUS_KM = 6371.0;

    /**
     * Calcula la distancia entre dos puntos geográficos usando la fórmula de Haversine
     * @param lat1 Latitud del punto 1
     * @param lon1 Longitud del punto 1
     * @param lat2 Latitud del punto 2
     * @param lon2 Longitud del punto 2
     * @return Distancia en metros
     */
    public double calcularDistancia(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        double distanciaKm = EARTH_RADIUS_KM * c;

        return distanciaKm * 1000; // Convertir a metros
    }

    /**
     * Verifica si una ubicación está dentro del radio de una sede
     * @param latitud Latitud de la ubicación a verificar
     * @param longitud Longitud de la ubicación a verificar
     * @param sede Sede con su ubicación y radio
     * @return true si está dentro del radio, false si no
     */
    public boolean estaDentroDelRadio(double latitud, double longitud, Sede sede) {
        if (sede.getLatitud() == null || sede.getLongitud() == null) {
            return false;
        }

        double distancia = calcularDistancia(
                latitud,
                longitud,
                sede.getLatitud(),
                sede.getLongitud()
        );

        return distancia <= sede.getRadioMetros();
    }

    /**
     * Valida que las coordenadas GPS sean válidas
     * @param latitud Latitud a validar
     * @param longitud Longitud a validar
     * @return true si son válidas, false si no
     */
    public boolean validarCoordenadas(Double latitud, Double longitud) {
        if (latitud == null || longitud == null) {
            return false;
        }

        return latitud >= -90 && latitud <= 90 &&
                longitud >= -180 && longitud <= 180;
    }

    /**
     * Valida que el radio esté dentro de los límites permitidos
     * @param radioMetros Radio en metros
     * @return true si es válido, false si no
     */
    public boolean validarRadio(Integer radioMetros) {
        if (radioMetros == null) {
            return false;
        }

        return radioMetros >= 20 && radioMetros <= 200;
    }
}
