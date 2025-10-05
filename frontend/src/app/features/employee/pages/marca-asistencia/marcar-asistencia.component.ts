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

type TipoMarcacion = 'entrada' | 'salida';

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

    // Tipo de marcación actual
    tipoMarcacion?: TipoMarcacion;

    // Estado del proceso
    currentStep: 'idle' | 'verificando-ubicacion' | 'capturando-rostro' | 'procesando' | 'completado' = 'idle';

    // Configuración del umbral de reconocimiento facial (90% = 0.90)
    private readonly UMBRAL_CONFIANZA = 0.90;

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
        // HU03 - Escenario 2: Validar que no hay entrada previa
        if (this.asistenciaHoy?.horaEntrada) {
            this.notificationService.warning('Ya has marcado entrada hoy');
            return;
        }

        this.tipoMarcacion = 'entrada';
        this.currentStep = 'verificando-ubicacion';
        this.verificarUbicacion();
    }

    /**
     * Inicia el proceso de marcación de salida
     */
    iniciarMarcarSalida(): void {
        // HU04 - Escenario 2: Validar que existe entrada previa
        if (!this.asistenciaHoy?.horaEntrada) {
            this.notificationService.error('No tienes entrada registrada');
            return;
        }

        if (this.asistenciaHoy?.horaSalida) {
            this.notificationService.warning('Ya has marcado salida hoy');
            return;
        }

        this.tipoMarcacion = 'salida';
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
            this.tipoMarcacion = undefined;
            return;
        }

        const sede = this.colaborador.sede;

        if (!sede.latitud || !sede.longitud) {
            this.notificationService.error('La sede no tiene ubicación configurada');
            this.currentStep = 'idle';
            this.tipoMarcacion = undefined;
            return;
        }

        this.verificandoUbicacion = true;

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
                    // HU03 - Escenario 1: Dentro del perímetro
                    this.notificationService.success(`Ubicación verificada (${this.distancia.toFixed(0)}m de la sede)`);
                    this.currentStep = 'capturando-rostro';
                } else {
                    // HU03 - Escenario 2: Fuera del perímetro
                    this.notificationService.error('Debes estar dentro del perímetro de la tienda');
                    this.currentStep = 'idle';
                    this.tipoMarcacion = undefined;
                }
            },
            error: (error) => {
                this.verificandoUbicacion = false;
                this.currentStep = 'idle';
                this.tipoMarcacion = undefined;
                this.notificationService.error(error.message || 'No se pudo obtener tu ubicación');
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
        if (!this.colaborador?.id || !this.ubicacionActual || !this.tipoMarcacion) return;

        this.currentStep = 'procesando';
        this.procesando = true;

        // Primero verificar el rostro con umbral del 90%
        this.reconocimientoService.verificarRostro({
            imagenBase64: imagenBase64,
            colaboradorId: this.colaborador.id
        }).subscribe({
            next: (response) => {
                if (response.success && response.data) {
                    const confianza = response.data.confianza;
                    const porcentajeConfianza = (confianza * 100).toFixed(0);

                    // HU03 - Verificar umbral de confianza del 90%
                    if (response.data.coincide && confianza >= this.UMBRAL_CONFIANZA) {
                        // Rostro verificado con suficiente confianza
                        if (this.tipoMarcacion === 'entrada') {
                            this.marcarEntrada(imagenBase64, confianza);
                        } else if (this.tipoMarcacion === 'salida') {
                            this.marcarSalida(imagenBase64, confianza);
                        }
                    } else {
                        this.procesando = false;
                        this.currentStep = 'idle';
                        this.tipoMarcacion = undefined;

                        if (confianza < this.UMBRAL_CONFIANZA) {
                            this.notificationService.error(
                                `Reconocimiento facial insuficiente (${porcentajeConfianza}%). Se requiere al menos 90%`
                            );
                        } else {
                            this.notificationService.error('No se pudo verificar tu identidad');
                        }
                    }
                } else {
                    this.procesando = false;
                    this.currentStep = 'idle';
                    this.tipoMarcacion = undefined;
                    this.notificationService.error('No se pudo verificar tu rostro');
                }
            },
            error: () => {
                this.procesando = false;
                this.currentStep = 'idle';
                this.tipoMarcacion = undefined;
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
                if (response.success && response.data) {
                    this.currentStep = 'completado';
                    this.asistenciaHoy = response.data;

                    // HU03 - Escenario 1: Mensaje de éxito
                    const porcentaje = (confianza * 100).toFixed(0);
                    this.notificationService.success(
                        `Entrada registrada correctamente (${dto.horaEntrada} - ${porcentaje}% coincidencia)`
                    );

                    setTimeout(() => {
                        this.currentStep = 'idle';
                        this.tipoMarcacion = undefined;
                    }, 3000);
                }
            },
            error: () => {
                this.procesando = false;
                this.currentStep = 'idle';
                this.tipoMarcacion = undefined;
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
                    this.asistenciaHoy = response.data;
                    const horas = response.data.horasTrabajadas || 0;

                    // HU04 - Escenario 1: Mensaje con horas trabajadas
                    const horasEnteras = Math.floor(horas);
                    const minutos = Math.round((horas - horasEnteras) * 60);
                    this.notificationService.success(
                        `Salida registrada. Trabajaste ${horasEnteras} horas${minutos > 0 ? ` y ${minutos} minutos` : ''}`
                    );

                    setTimeout(() => {
                        this.currentStep = 'idle';
                        this.tipoMarcacion = undefined;
                    }, 3000);
                }
            },
            error: () => {
                this.procesando = false;
                this.currentStep = 'idle';
                this.tipoMarcacion = undefined;
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
        this.tipoMarcacion = undefined;
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

    /**
     * Obtiene el texto del botón de captura
     */
    get textoBotonCaptura(): string {
        return this.tipoMarcacion === 'entrada' ? 'Capturar y Marcar Entrada' : 'Capturar y Marcar Salida';
    }

    /**
     * Obtiene el ícono según el tipo de marcación
     */
    get iconoMarcacion(): string {
        return this.tipoMarcacion === 'entrada' ? 'login' : 'logout';
    }
}