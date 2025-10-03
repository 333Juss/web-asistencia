import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { AsistenciaService } from '../../services/asistencia.service';
import { BiometriaService } from '../../services/biometria.service';
import { ReconocimientoFacialService } from '../../services/reconocimiento-facial.service';
import { CameraCaptureComponent } from '../../../../components/camera-capture/camera-capture.component';
import { Asistencia, Colaborador, MarcarEntradaDto, MarcarSalidaDto } from '../../../../components/models';
import { GeolocationService, UserLocation } from '../../../../core/services/geolocation.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';


@Component({
    selector: 'app-marcar-asistencia',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatDividerModule,
        CameraCaptureComponent
    ],
    templateUrl: './marcar-asistencia.component.html',
    styleUrls: ['./marcar-asistencia.component.scss']
})
export class MarcarAsistenciaComponent implements OnInit {

    @ViewChild(CameraCaptureComponent) cameraComponent?: CameraCaptureComponent;

    colaborador?: Colaborador;
    asistenciaHoy?: Asistencia | null;

    // Estados
    loading = false;
    procesando = false;
    verificandoUbicacion = false;
    capturandoRostro = false;

    // Datos de ubicación
    ubicacionActual?: UserLocation;
    dentroDeRadio = false;
    distancia?: number;

    // Estado del proceso
    currentStep: 'idle' | 'verificando-ubicacion' | 'capturando-rostro' | 'procesando' | 'completado' = 'idle';

    constructor(
        private asistenciaService: AsistenciaService,
        private biometriaService: BiometriaService,
        private reconocimientoService: ReconocimientoFacialService,
        private geolocationService: GeolocationService,
        private authService: AuthService,
        private notificationService: NotificationService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadColaborador();
    }

    /**
     * Carga los datos del colaborador y su asistencia
     */
    private loadColaborador(): void {
        this.colaborador = this.authService.getCurrentColaborador() || undefined;

        if (!this.colaborador) {
            this.notificationService.error('No se pudo cargar la información del colaborador');
            this.router.navigate(['/']);
            return;
        }

        // Verificar datos biométricos
        this.checkBiometricData();

        // Cargar asistencia del día
        this.loadAsistenciaHoy();
    }

    /**
     * Verifica si tiene datos biométricos
     */
    private checkBiometricData(): void {
        if (!this.colaborador?.id) return;

        this.biometriaService.tieneDatosBiometricos(this.colaborador.id).subscribe({
            next: (response) => {
                if (response.success && !response.data?.tiene) {
                    this.notificationService.warning('Debes registrar tus datos biométricos primero');
                    this.router.navigate(['/employee/registro-biometrico']);
                }
            }
        });
    }

    /**
     * Carga la asistencia del día actual
     */
    private loadAsistenciaHoy(): void {
        if (!this.colaborador?.id) return;

        this.loading = true;
        this.asistenciaService.getAsistenciaHoy(this.colaborador.id).subscribe({
            next: (response) => {
                if (response.success) {
                    this.asistenciaHoy = response.data;
                }
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    /**
     * Inicia el proceso de marcación de entrada
     */
    iniciarMarcarEntrada(): void {
        this.currentStep = 'verificando-ubicacion';
        this.verificarUbicacion();
    }

    /**
     * Inicia el proceso de marcación de salida
     */
    iniciarMarcarSalida(): void {
        this.currentStep = 'verificando-ubicacion';
        this.verificarUbicacion();
    }

    /**
     * Verifica la ubicación del usuario
     */
    private verificarUbicacion(): void {
        if (!this.colaborador?.sede) {
            this.notificationService.error('No tienes una sede asignada');
            this.currentStep = 'idle';
            return;
        }

        const sede = this.colaborador.sede;

        if (!sede.latitud || !sede.longitud) {
            this.notificationService.error('La sede no tiene ubicación configurada');
            this.currentStep = 'idle';
            return;
        }

        this.verificandoUbicacion = true;
        this.notificationService.verificandoUbicacion();

        this.geolocationService.getCurrentPosition().subscribe({
            next: (location: UserLocation) => {
                this.ubicacionActual = location;

                // Verificar si está dentro del radio
                const distanciaInfo = this.geolocationService.getDistanceInfo(
                    location.latitude,
                    location.longitude,
                    sede.latitud!,
                    sede.longitud!,
                    sede.radioMetros
                );

                this.distancia = distanciaInfo.distance;
                this.dentroDeRadio = distanciaInfo.isWithin;

                this.verificandoUbicacion = false;

                if (this.dentroDeRadio) {
                    this.notificationService.success(distanciaInfo.message);
                    this.currentStep = 'capturando-rostro';
                } else {
                    this.notificationService.fueraDeZona();
                    this.notificationService.warning(distanciaInfo.message);
                    this.currentStep = 'idle';
                }
            },
            error: (error) => {
                this.verificandoUbicacion = false;
                this.currentStep = 'idle';
                this.notificationService.error(error.message);
            }
        });
    }

    /**
     * Captura el rostro y procesa
     */
    capturarRostro(): void {
        if (!this.cameraComponent) return;

        this.capturandoRostro = true;
        this.cameraComponent.capturePhoto();
    }

    /**
     * Maneja la captura de imágenes
     */
    onImagesCaptured(images: any[]): void {
        if (images.length === 0) return;

        const primerImagen = images[0];
        this.procesarMarcacion(primerImagen.imageBase64);
    }

    /**
     * Procesa la marcación (entrada o salida)
     */
    private procesarMarcacion(imagenBase64: string): void {
        if (!this.colaborador?.id || !this.ubicacionActual) return;

        this.currentStep = 'procesando';
        this.procesando = true;

        // Primero verificar el rostro
        this.reconocimientoService.verificarRostro({
            imagenBase64: imagenBase64,
            colaboradorId: this.colaborador.id
        }).subscribe({
            next: (response) => {
                if (response.success && response.data) {
                    if (response.data.coincide && this.reconocimientoService.esConfianzaSuficiente(response.data.confianza)) {
                        // Rostro verificado, proceder con la marcación
                        if (this.asistenciaHoy?.horaEntrada && !this.asistenciaHoy?.horaSalida) {
                            this.marcarSalida(imagenBase64, response.data.confianza);
                        } else {
                            this.marcarEntrada(imagenBase64, response.data.confianza);
                        }
                    } else {
                        this.procesando = false;
                        this.currentStep = 'idle';
                        this.notificationService.bajaConfianza();
                    }
                }
            },
            error: () => {
                this.procesando = false;
                this.currentStep = 'idle';
            }
        });
    }

    /**
     * Marca la entrada
     */
    private marcarEntrada(imagenBase64: string, confianza: number): void {
        if (!this.colaborador?.id || !this.colaborador.sede?.id || !this.ubicacionActual) return;

        const now = new Date();
        const dto: MarcarEntradaDto = {
            colaboradorId: this.colaborador.id,
            sedeId: this.colaborador.sede.id,
            fecha: now.toISOString().split('T')[0],
            horaEntrada: now.toTimeString().split(' ')[0].substring(0, 5),
            latitud: this.ubicacionActual.latitude,
            longitud: this.ubicacionActual.longitude,
            imagenFacial: imagenBase64,
            confianzaFacial: confianza
        };

        this.asistenciaService.marcarEntrada(dto).subscribe({
            next: (response) => {
                this.procesando = false;
                if (response.success) {
                    this.currentStep = 'completado';
                    this.notificationService.entradaRegistrada();
                    this.asistenciaHoy = response.data;

                    setTimeout(() => {
                        this.currentStep = 'idle';
                    }, 3000);
                }
            },
            error: () => {
                this.procesando = false;
                this.currentStep = 'idle';
            }
        });
    }

    /**
     * Marca la salida
     */
    private marcarSalida(imagenBase64: string, confianza: number): void {
        if (!this.asistenciaHoy?.id || !this.ubicacionActual) return;

        const now = new Date();
        const dto: MarcarSalidaDto = {
            asistenciaId: this.asistenciaHoy.id,
            horaSalida: now.toTimeString().split(' ')[0].substring(0, 5),
            latitud: this.ubicacionActual.latitude,
            longitud: this.ubicacionActual.longitude,
            imagenFacial: imagenBase64,
            confianzaFacial: confianza
        };

        this.asistenciaService.marcarSalida(dto).subscribe({
            next: (response) => {
                this.procesando = false;
                if (response.success && response.data) {
                    this.currentStep = 'completado';
                    const horas = response.data.horasTrabajadas || 0;
                    this.notificationService.salidaRegistrada(horas);
                    this.asistenciaHoy = response.data;

                    setTimeout(() => {
                        this.currentStep = 'idle';
                    }, 3000);
                }
            },
            error: () => {
                this.procesando = false;
                this.currentStep = 'idle';
            }
        });
    }

    /**
     * Cancela el proceso actual
     */
    cancelar(): void {
        this.currentStep = 'idle';
        this.ubicacionActual = undefined;
        this.dentroDeRadio = false;
        this.distancia = undefined;
    }

    /**
     * Navega al historial
     */
    verHistorial(): void {
        this.router.navigate(['/employee/mis-asistencias']);
    }

    /**
     * Obtiene el estado de la asistencia
     */
    get estadoAsistencia(): string {
        if (!this.asistenciaHoy) return 'Sin registrar';
        if (this.asistenciaHoy.horaEntrada && !this.asistenciaHoy.horaSalida) return 'En turno';
        if (this.asistenciaHoy.horaEntrada && this.asistenciaHoy.horaSalida) return 'Completado';
        return 'Sin registrar';
    }

    /**
     * Puede marcar entrada
     */
    get puedeMarcarEntrada(): boolean {
        return !this.asistenciaHoy || !this.asistenciaHoy.horaEntrada;
    }

    /**
     * Puede marcar salida
     */
    get puedeMarcarSalida(): boolean {
        return this.asistenciaHoy?.horaEntrada !== undefined && !this.asistenciaHoy?.horaSalida;
    }

    /**
     * Formatea la hora
     */
    formatHora(hora?: string): string {
        if (!hora) return '-';
        return hora.substring(0, 5);
    }
}