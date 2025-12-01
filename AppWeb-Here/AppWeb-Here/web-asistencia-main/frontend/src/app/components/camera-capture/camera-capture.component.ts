import { Component, EventEmitter, Input, Output, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NotificationService } from '../../core/services/notification.service';


export interface CapturedImage {
    imageBase64: string;
    timestamp: number;
    order: number;
}

@Component({
    selector: 'app-camera-capture',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatProgressBarModule
    ],
    templateUrl: './camera-capture.component.html',
    styleUrls: ['./camera-capture.component.scss']
})
export class CameraCaptureComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('videoElement', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
    @ViewChild('canvasElement', { static: false }) canvasElement!: ElementRef<HTMLCanvasElement>;

    @Input() maxImages: number = 5;
    @Input() imageWidth: number = 640;
    @Input() imageHeight: number = 480;
    @Input() showPreview: boolean = true;

    @Output() imagesCaptures = new EventEmitter<CapturedImage[]>();
    @Output() captureComplete = new EventEmitter<void>();

    stream: MediaStream | null = null;
    capturedImages: CapturedImage[] = [];
    isCapturing: boolean = false;
    cameraActive: boolean = false;
    isCameraAvailable: boolean = true;
    countdown: number = 0;
    currentImageOrder: number = 1;

    constructor(private notificationService: NotificationService) { }

    ngOnInit(): void {
        // No iniciar aquí - esperar a AfterViewInit
    }

    ngAfterViewInit(): void {
        // Iniciar cámara después de que la vista esté lista
        // Dar más tiempo para que el DOM esté completamente renderizado
        setTimeout(() => {
            console.log('🔍 Verificando elemento de video...');
            console.log('videoElement:', this.videoElement);
            console.log('videoElement.nativeElement:', this.videoElement?.nativeElement);
            this.startCamera();
        }, 1000);
    }

    ngOnDestroy(): void {
        this.stopCamera();
    }

    /**
     * Inicia la cámara
     */
    async startCamera(): Promise<void> {
        try {
            console.log('🎥 Intentando iniciar cámara...');

            // Verificar si getUserMedia está disponible
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                console.error('❌ getUserMedia no disponible');
                this.isCameraAvailable = false;
                this.notificationService.error('Tu navegador no soporta acceso a la cámara');
                return;
            }

            console.log('📹 Solicitando acceso a la cámara...');
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: this.imageWidth },
                    height: { ideal: this.imageHeight },
                    facingMode: 'user' // Cámara frontal
                },
                audio: false
            });

            console.log('✅ Stream obtenido:', this.stream);

            // Verificar que el elemento de video existe
            if (!this.videoElement || !this.videoElement.nativeElement) {
                console.error('❌ Elemento de video no encontrado');
                this.notificationService.error('Error al inicializar el componente de video');
                return;
            }

            // Asignar stream al video
            const videoEl = this.videoElement.nativeElement;
            videoEl.srcObject = this.stream;

            // Esperar a que el video esté listo
            videoEl.onloadedmetadata = () => {
                console.log('✅ Video listo para reproducir');
                videoEl.play().then(() => {
                    console.log('✅ Video reproduciéndose');
                    this.cameraActive = true;
                    this.isCameraAvailable = true;
                }).catch(err => {
                    console.error('❌ Error al reproducir video:', err);
                });
            };

        } catch (error: any) {
            console.error('❌ Error al acceder a la cámara:', error);
            let errorMessage = 'No se pudo acceder a la cámara.';

            if (error.name === 'NotAllowedError') {
                errorMessage = 'Permiso denegado. Por favor, permite el acceso a la cámara.';
            } else if (error.name === 'NotFoundError') {
                errorMessage = 'No se encontró ninguna cámara en este dispositivo.';
            } else if (error.name === 'NotReadableError') {
                errorMessage = 'La cámara está siendo usada por otra aplicación.';
            }

            this.notificationService.error(errorMessage);
            this.cameraActive = false;
            this.isCameraAvailable = false;
        }
    }

    /**
     * Detiene la cámara
     */
    stopCamera(): void {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
            this.cameraActive = false;
        }
    }

    /**
     * Captura una foto
     */
    capturePhoto(): void {
        if (!this.cameraActive || this.isCapturing) {
            return;
        }

        if (this.capturedImages.length >= this.maxImages) {
            this.notificationService.warning(`Ya has capturado ${this.maxImages} fotos`);
            return;
        }

        this.isCapturing = true;
        this.countdown = 3;

        // Cuenta regresiva
        const countdownInterval = setInterval(() => {
            this.countdown--;
            if (this.countdown === 0) {
                clearInterval(countdownInterval);
                this.takeSnapshot();
            }
        }, 1000);
    }

    /**
     * Toma la foto
     */
    private takeSnapshot(): void {
        const video = this.videoElement.nativeElement;
        const canvas = this.canvasElement.nativeElement;
        const context = canvas.getContext('2d');

        if (context && video) {
            canvas.width = this.imageWidth;
            canvas.height = this.imageHeight;

            // Dibujar el video en el canvas
            context.drawImage(video, 0, 0, this.imageWidth, this.imageHeight);

            // Convertir a base64
            const imageBase64 = canvas.toDataURL('image/jpeg', 0.8);

            // Guardar la imagen
            const capturedImage: CapturedImage = {
                imageBase64: imageBase64,
                timestamp: Date.now(),
                order: this.currentImageOrder
            };

            this.capturedImages.push(capturedImage);
            this.currentImageOrder++;

            this.notificationService.success(`Foto ${this.capturedImages.length} capturada`);

            // Emitir evento de imágenes capturadas
            this.imagesCaptures.emit(this.capturedImages);

            // Si ya se capturaron todas las fotos
            if (this.capturedImages.length >= this.maxImages) {
                this.onComplete();
            }
        }

        this.isCapturing = false;
        this.countdown = 0;
    }

    /**
     * Elimina una foto capturada
     */
    removeImage(index: number): void {
        this.capturedImages.splice(index, 1);
        this.currentImageOrder = this.capturedImages.length + 1;
    }

    /**
     * Reinicia la captura
     */
    reset(): void {
        this.capturedImages = [];
        this.currentImageOrder = 1;
    }

    /**
     * Completa el proceso de captura
     */
    onComplete(): void {
        this.imagesCaptures.emit(this.capturedImages);
        this.captureComplete.emit();
        this.stopCamera();
    }

    /**
     * Progreso de captura
     */
    get captureProgress(): number {
        return (this.capturedImages.length / this.maxImages) * 100;
    }
}