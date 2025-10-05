import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { UbicacionSede } from '../../../../../components/models';


@Component({
    selector: 'app-sede-map',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './sede-map.component.html',
    styleUrls: ['./sede-map.component.scss']
})
export class SedeMapComponent implements OnInit, AfterViewInit, OnDestroy {

    @Input() ubicacion?: UbicacionSede;
    @Input() editable: boolean = true;
    @Input() height: string = '400px';

    @Output() ubicacionChange = new EventEmitter<UbicacionSede>();

    private map?: L.Map;
    private marker?: L.Marker;
    private circle?: L.Circle;

    // Lima, Perú como ubicación por defecto
    private defaultLocation: L.LatLngExpression = [-12.0464, -77.0428];
    private defaultZoom = 12;

    ngOnInit(): void {
        // Fix para los iconos de Leaflet en Angular
        this.fixLeafletIconPath();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.initMap();
        }, 100);
    }

    ngOnDestroy(): void {
        if (this.map) {
            this.map.remove();
        }
    }

    /**
     * Fix para la ruta de los iconos de Leaflet
     */
    private fixLeafletIconPath(): void {
        const iconRetinaUrl = 'assets/marker-icon-2x.png';
        const iconUrl = 'assets/marker-icon.png';
        const shadowUrl = 'assets/marker-shadow.png';
        const iconDefault = L.icon({
            iconRetinaUrl,
            iconUrl,
            shadowUrl,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            tooltipAnchor: [16, -28],
            shadowSize: [41, 41]
        });
        L.Marker.prototype.options.icon = iconDefault;
    }

    /**
     * Inicializa el mapa
     */
    private initMap(): void {
        const location = this.ubicacion
            ? [this.ubicacion.latitud, this.ubicacion.longitud] as L.LatLngExpression
            : this.defaultLocation;

        this.map = L.map('map', {
            center: location,
            zoom: this.ubicacion ? 16 : this.defaultZoom,
            zoomControl: true
        });

        // Agregar capa de mapa
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(this.map);

        // Si hay ubicación inicial, mostrar marcador y círculo
        if (this.ubicacion) {
            this.addMarkerAndCircle(
                this.ubicacion.latitud,
                this.ubicacion.longitud,
                this.ubicacion.radioMetros
            );
        }

        // Si es editable, agregar evento de clic
        if (this.editable) {
            this.map.on('click', (e: L.LeafletMouseEvent) => {
                this.onMapClick(e);
            });
        }
    }

    /**
     * Maneja el clic en el mapa
     */
    private onMapClick(e: L.LeafletMouseEvent): void {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        const radio = this.ubicacion?.radioMetros || 50;

        this.addMarkerAndCircle(lat, lng, radio);

        // Emitir cambio
        this.ubicacionChange.emit({
            latitud: lat,
            longitud: lng,
            radioMetros: radio
        });
    }

    /**
     * Agrega marcador y círculo al mapa
     */
    private addMarkerAndCircle(lat: number, lng: number, radio: number): void {
        if (!this.map) return;

        // Remover marcador y círculo anteriores
        if (this.marker) {
            this.map.removeLayer(this.marker);
        }
        if (this.circle) {
            this.map.removeLayer(this.circle);
        }

        // Agregar nuevo marcador
        this.marker = L.marker([lat, lng], {
            draggable: this.editable
        }).addTo(this.map);

        if (this.editable) {
            this.marker.on('dragend', (event: L.DragEndEvent) => {
                const position = event.target.getLatLng();
                this.updateCirclePosition(position.lat, position.lng);
                this.ubicacionChange.emit({
                    latitud: position.lat,
                    longitud: position.lng,
                    radioMetros: radio
                });
            });
        }

        // Agregar círculo de radio
        this.circle = L.circle([lat, lng], {
            color: '#6C5CE7',
            fillColor: '#6C5CE7',
            fillOpacity: 0.2,
            radius: radio
        }).addTo(this.map);

        // Popup con información
        const popupContent = `
      <b>Ubicación de la Sede</b><br>
      Latitud: ${lat.toFixed(6)}<br>
      Longitud: ${lng.toFixed(6)}<br>
      Radio: ${radio}m
    `;
        this.marker.bindPopup(popupContent);
    }

    /**
     * Actualiza la posición del círculo
     */
    private updateCirclePosition(lat: number, lng: number): void {
        if (this.circle) {
            this.circle.setLatLng([lat, lng]);
        }
    }

    /**
     * Actualiza el radio del círculo
     */
    updateRadius(radio: number): void {
        if (this.circle) {
            this.circle.setRadius(radio);
        }

        if (this.marker) {
            const position = this.marker.getLatLng();
            this.ubicacionChange.emit({
                latitud: position.lat,
                longitud: position.lng,
                radioMetros: radio
            });

            // Actualizar popup
            const popupContent = `
        <b>Ubicación de la Sede</b><br>
        Latitud: ${position.lat.toFixed(6)}<br>
        Longitud: ${position.lng.toFixed(6)}<br>
        Radio: ${radio}m
      `;
            this.marker.setPopupContent(popupContent);
        }
    }

    /**
     * Centra el mapa en una ubicación específica
     */
    centerMap(lat: number, lng: number, zoom: number = 16): void {
        if (this.map) {
            this.map.setView([lat, lng], zoom);
        }
    }

    /**
     * Obtiene la ubicación actual del usuario
     */
    getCurrentLocation(): void {
        if (!navigator.geolocation) {
            console.error('Geolocalización no soportada');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const radio = this.ubicacion?.radioMetros || 50;

                this.centerMap(lat, lng);
                this.addMarkerAndCircle(lat, lng, radio);

                this.ubicacionChange.emit({
                    latitud: lat,
                    longitud: lng,
                    radioMetros: radio
                });
            },
            (error) => {
                console.error('Error obteniendo ubicación:', error);
            }
        );
    }
}