import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AsistenciaService } from '../../services/asistencia.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { AsistenciaListItem, AsistenciaResumen, Colaborador, FilterRequest } from '../../../../components/models';

@Component({
  selector: 'app-mis-asistencias',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatTooltipModule
  ],
  templateUrl: './mis-asistencias.component.html',
  styleUrls: ['./mis-asistencias.component.scss']
})
export class MisAsistenciasComponent implements OnInit {

  colaborador?: Colaborador;
  asistencias: AsistenciaListItem[] = [];
  resumen?: AsistenciaResumen;

  // Estados
  loading = false;
  loadingResumen = false;

  // Paginación
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25, 50];

  // Filtros
  filterForm: FormGroup;

  // Columnas de la tabla
  displayedColumns: string[] = ['fecha', 'entrada', 'salida', 'horas', 'estado', 'acciones'];

  // Período predefinido
  periodoSeleccionado = 'mes-actual';

  constructor(
    private asistenciaService: AsistenciaService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      startDate: [this.getStartOfMonth()],
      endDate: [new Date()]
    });
  }

  ngOnInit(): void {
    this.loadColaborador();
  }

  /**
   * Carga los datos del colaborador
   */
  private loadColaborador(): void {
    this.colaborador = this.authService.getCurrentColaborador() || undefined;

    if (!this.colaborador) {
      this.notificationService.error('No se pudo cargar la información del colaborador');
      this.router.navigate(['/']);
      return;
    }

    this.loadAsistencias();
    this.loadResumen();
  }

  /**
   * Carga las asistencias con filtros y paginación
   */
  loadAsistencias(): void {
    if (!this.colaborador?.id) return;

    this.loading = true;

    const filterRequest: FilterRequest = {
      page: this.pageIndex,
      size: this.pageSize,
      startDate: this.formatDate(this.filterForm.value.startDate),
      endDate: this.formatDate(this.filterForm.value.endDate),
      sort: ['fecha,desc']
    };

    this.asistenciaService.getAsistencias(this.colaborador.id, filterRequest).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.asistencias = response.data.content;
          this.totalElements = response.data.totalElements;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  /**
   * Carga el resumen del período
   */
  loadResumen(): void {
    if (!this.colaborador?.id) return;

    this.loadingResumen = true;

    const startDate = this.formatDate(this.filterForm.value.startDate);
    const endDate = this.formatDate(this.filterForm.value.endDate);

    this.asistenciaService.getResumen(this.colaborador.id, startDate, endDate).subscribe({
      next: (response) => {
        if (response.success) {
          this.resumen = response.data;
        }
        this.loadingResumen = false;
      },
      error: () => {
        this.loadingResumen = false;
      }
    });
  }

  /**
   * Maneja el cambio de página
   */
  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadAsistencias();
  }
  onPeriodoChange(event: any): void {
    const value = event.value;
    if (value) {
      this.cambiarPeriodo(value);
    }
  }
  /**
   * Aplica los filtros
   */
  aplicarFiltros(): void {
    this.pageIndex = 0;
    this.loadAsistencias();
    this.loadResumen();
  }

  /**
   * Limpia los filtros
   */
  limpiarFiltros(): void {
    this.filterForm.patchValue({
      startDate: this.getStartOfMonth(),
      endDate: new Date()
    });
    this.periodoSeleccionado = 'mes-actual';
    this.aplicarFiltros();
  }

  /**
   * Cambia el período predefinido
   */
  cambiarPeriodo(periodo: string): void {
    this.periodoSeleccionado = periodo;
    const today = new Date();
    let startDate: Date;
    let endDate = today;

    switch (periodo) {
      case 'hoy':
        startDate = today;
        endDate = today;
        break;
      case 'semana-actual':
        startDate = this.getStartOfWeek();
        break;
      case 'mes-actual':
        startDate = this.getStartOfMonth();
        break;
      case 'mes-anterior':
        startDate = this.getStartOfLastMonth();
        endDate = this.getEndOfLastMonth();
        break;
      case 'ultimos-30':
        startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = this.getStartOfMonth();
    }

    this.filterForm.patchValue({
      startDate,
      endDate
    });

    this.aplicarFiltros();
  }

  /**
   * Exporta a Excel (mock - implementar según backend)
   */
  exportarExcel(): void {
    this.notificationService.info('Función de exportación próximamente');
    // Implementar según tu backend
  }

  /**
   * Ver detalle de una asistencia
   */
  verDetalle(asistencia: AsistenciaListItem): void {
    // Implementar modal o navegación a detalle
    console.log('Ver detalle:', asistencia);
  }

  /**
   * Volver a la pantalla de marcar asistencia
   */
  volverAMarcar(): void {
    this.router.navigate(['/employee/marcar-asistencia']);
  }

  /**
   * Obtiene el estado visual de la asistencia
   */
  getEstadoAsistencia(asistencia: AsistenciaListItem): { text: string; class: string; icon: string } {
    if (asistencia.horaEntrada && asistencia.horaSalida) {
      return { text: 'Completo', class: 'estado-completo', icon: 'check_circle' };
    } else if (asistencia.horaEntrada) {
      return { text: 'En turno', class: 'estado-turno', icon: 'schedule' };
    } else {
      return { text: 'Pendiente', class: 'estado-pendiente', icon: 'pending' };
    }
  }

  /**
   * Formatea la fecha
   */
  formatDate(date: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  /**
   * Formatea la hora
   */
  formatHora(hora?: string): string {
    if (!hora) return '-';
    return hora.substring(0, 5);
  }

  /**
   * Formatea las horas trabajadas
   */
  formatHorasTrabajadas(horas?: number): string {
    if (!horas) return '-';
    const h = Math.floor(horas);
    const m = Math.round((horas - h) * 60);
    return `${h}h ${m}m`;
  }

  /**
   * Obtiene el inicio de la semana
   */
  private getStartOfWeek(): Date {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(today.setDate(diff));
  }

  /**
   * Obtiene el inicio del mes
   */
  private getStartOfMonth(): Date {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  }

  /**
   * Obtiene el inicio del mes anterior
   */
  private getStartOfLastMonth(): Date {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth() - 1, 1);
  }

  /**
   * Obtiene el fin del mes anterior
   */
  private getEndOfLastMonth(): Date {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 0);
  }

  /**
   * Obtiene el nombre del día
   */
  getDiaSemana(fecha: string): string {
    const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const date = new Date(fecha + 'T00:00:00');
    return dias[date.getDay()];
  }

  /**
   * Formatea la fecha completa
   */
  formatFechaCompleta(fecha: string): string {
    const date = new Date(fecha + 'T00:00:00');
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    };
    return date.toLocaleDateString('es-ES', options);
  }
}