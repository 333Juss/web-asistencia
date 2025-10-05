import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { CameraCaptureComponent, CapturedImage } from '../../../../components/camera-capture/camera-capture.component';
import { CapturarRostroDto, Colaborador, ImagenFacial } from '../../../../components/models';
import { BiometriaService } from '../../services/biometria.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';


@Component({
    selector: 'app-registro-biometrico',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatStepperModule,
        MatProgressBarModule,
        MatListModule,
        CameraCaptureComponent
    ],
    templateUrl: './registro-biometrico.component.html',
    styleUrls: ['./registro-biometrico.component.scss']
})
export class RegistroBiometricoComponent implements OnInit {

    @ViewChild(CameraCaptureComponent) cameraComponent?: CameraCaptureComponent;

    colaborador?: Colaborador;
    currentStep = 0;
    capturedImages: CapturedImage[] = [];
    submitting = false;

    readonly MAX_IMAGES = 5;
    readonly REQUIRED_IMAGES = 5;

    // Instrucciones para cada paso
    instructions = [
        {
            title: 'Bienvenido al Registro Biométrico',
            description: 'Necesitamos capturar 5 fotos de tu rostro para el sistema de asistencia.',
            icon: 'face',
            tips: [
                'Asegúrate de tener buena iluminación',
                'Retira gafas, gorras u otros accesorios',
                'Mantén tu rostro centrado en el círculo',
                'No sonrías en exceso, mantén expresión neutral'
            ]
        },
        {
            title: 'Captura de Rostro',
            description: 'Sigue las instrucciones en pantalla para capturar tus fotos.',
            icon: 'camera_alt',
            tips: [
                'Mira directamente a la cámara',
                'Espera la cuenta regresiva antes de cada foto',
                'No muevas la cabeza durante la captura',
                'Si una foto sale mal, puedes eliminarla y repetirla'
            ]
        },
        {
            title: 'Verificación y Envío',
            description: 'Revisa las fotos capturadas antes de enviarlas.',
            icon: 'check_circle',
            tips: [
                'Verifica que todas las fotos sean claras',
                'Tu rostro debe ser visible en todas',
                'Puedes eliminar y volver a capturar si es necesario',
                'Una vez enviadas, se procesarán para el reconocimiento'
            ]
        }
    ];

    constructor(
        private biometriaService: BiometriaService,
        private authService: AuthService,
        private notificationService: NotificationService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadColaborador();
    }

    /**
     * Carga los datos del colaborador actual
     */
    private loadColaborador(): void {
        this.colaborador = this.authService.getCurrentColaborador() || undefined;

        if (!this.colaborador) {
            this.notificationService.error('No se pudo cargar la información del colaborador');
            this.router.navigate(['/']);
            return;
        }

        // Verificar si ya tiene datos biométricos
        this.checkExistingBiometrics();
    }

    /**
     * Verifica si ya tiene datos biométricos registrados
     */
    private checkExistingBiometrics(): void {
        if (!this.colaborador?.id) return;

        this.biometriaService.tieneDatosBiometricos(this.colaborador.id).subscribe({
            next: (response) => {
                if (response.success && response.data?.tiene) {
                    this.notificationService.info(
                        `Ya tienes ${response.data.cantidad} foto(s) registrada(s). Puedes actualizar tus datos biométricos.`
                    );
                }
            }
        });
    }

    /**
     * Maneja las imágenes capturadas
     */
    onImagesCaptures(images: CapturedImage[]): void {
        this.capturedImages = images;
    }

    /**
     * Avanza al siguiente paso
     */
    nextStep(): void {
        if (this.currentStep < this.instructions.length - 1) {
            this.currentStep++;
        }
    }

    /**
     * Retrocede al paso anterior
     */
    previousStep(): void {
        if (this.currentStep > 0) {
            this.currentStep--;
        }
    }

    /**
     * Verifica si puede avanzar al siguiente paso
     */
    canGoNext(): boolean {
        if (this.currentStep === 1) {
            return this.capturedImages.length >= this.REQUIRED_IMAGES;
        }
        return true;
    }

    /**
     * Envía las imágenes al servidor
     */
    async submitImages(): Promise<void> {
        if (!this.colaborador?.id) {
            this.notificationService.error('No se pudo identificar al colaborador');
            return;
        }

        if (this.capturedImages.length < this.REQUIRED_IMAGES) {
            this.notificationService.warning(`Debes capturar al menos ${this.REQUIRED_IMAGES} fotos`);
            return;
        }

        this.submitting = true;

        try {
            // Validar calidad de imágenes localmente
            for (const img of this.capturedImages) {
                const validation = await this.biometriaService.validarCalidadLocal(img.imageBase64);
                if (!validation.valida) {
                    this.notificationService.error(`Error en la foto ${img.order}: ${validation.mensaje}`);
                    this.submitting = false;
                    return;
                }
            }

            // Preparar DTO
            const imagenes: ImagenFacial[] = this.capturedImages.map((img, index) => ({
                imagenBase64: img.imageBase64,
                orden: index + 1
            }));

            const dto: CapturarRostroDto = {
                colaboradorId: this.colaborador.id,
                imagenes: imagenes
            };

            // Enviar al servidor
            this.biometriaService.capturarRostro(dto).subscribe({
                next: (response) => {
                    this.submitting = false;
                    if (response.success) {
                        this.notificationService.rostroRegistrado();
                        this.showSuccessDialog(response.data!);
                    }
                },
                error: () => {
                    this.submitting = false;
                }
            });

        } catch (error) {
            this.submitting = false;
            this.notificationService.error('Error al procesar las imágenes');
        }
    }

    /**
     * Muestra el diálogo de éxito
     */
    private showSuccessDialog(data: any): void {
        setTimeout(() => {
            this.router.navigate(['/employee/marcar-asistencia']);
        }, 2000);
    }

    /**
     * Reinicia el proceso
     */
    restart(): void {
        this.currentStep = 0;
        this.capturedImages = [];
        if (this.cameraComponent) {
            this.cameraComponent.reset();
        }
    }

    /**
     * Cancela el proceso
     */
    cancel(): void {
        this.router.navigate(['/employee']);
    }

    /**
     * Calcula el progreso
     */
    get progress(): number {
        return (this.capturedImages.length / this.REQUIRED_IMAGES) * 100;
    }
}