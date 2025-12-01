import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { FormsModule } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';

import { Turno } from '../../../../../components/models';
import { TurnoService } from '../../../services/turno.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import {MatDividerModule} from '@angular/material/divider';

@Component({
  selector: 'app-turno-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    MatTooltipModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  templateUrl: './turno-list.component.html',
  styleUrls: ['./turno-list.component.scss']
})
export class TurnoListComponent implements OnInit {

  displayedColumns: string[] = [
    'nombre',
    'horario',
    'tolerancia',
    'estado',
    'acciones'
  ];

  dataSource = new MatTableDataSource<Turno>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  loading = false;
  searchTerm = '';

  pageSize = 10;
  totalElements = 0;
  currentPage = 0;

  private searchSubject = new Subject<string>();

  constructor(
    private turnoService: TurnoService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTurnos();
    this.setupSearch();
  }

  /** 🔍 Debounce de búsqueda */
  private setupSearch(): void {
    this.searchSubject
      .pipe(debounceTime(400))
      .subscribe(() => {
        this.currentPage = 0;
        this.loadTurnos();
      });
  }

  /** 🔄 Buscar */
  onSearch(value: string) {
    this.searchTerm = value;
    this.searchSubject.next(value);
  }

  /** ❌ Limpiar filtros */
  clearFilters(): void {
    this.searchTerm = '';
    this.currentPage = 0;
    this.loadTurnos();
  }

  /** 📄 Cargar turnos */
  loadTurnos(): void {
    console.log("Cargando turnos..."); // ← DEBUG

    this.loading = true;

    this.turnoService.getTurnos({
      page: this.currentPage,
      size: this.pageSize,
      search: this.searchTerm,
      sort: []
    }).subscribe({
      next: (res: any) => {
        console.log("Respuesta recibida:", res);

        this.dataSource.data =
          res?.data?.content ??
          [];
        this.totalElements = res.data?.totalElements ?? res.length;

        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  onSortChange(): void {
    this.loadTurnos();
  }

  /** 🔄 Cambio de página */
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadTurnos();
  }

  /** ➕ Crear turno */
  addTurno() {
    this.router.navigate(['/admin/turnos/nuevo']);
  }

  /** 👁️ Ver detalle */
  viewTurno(id: number) {
    this.router.navigate(['/admin/turnos/', id]);
 }

  /** ✏️ Editar */
  editTurno(id: number) {
    this.router.navigate(['/admin/turnos/editar', id]);
  }

  /** 🔁 Activar/desactivar */
  toggleStatus(turno: Turno) {
    const nuevoEstado = !turno.activo;

    this.turnoService.toggleTurnoStatus(turno.id!, nuevoEstado).subscribe({
      next: (res) => {
        this.notificationService.success('Estado actualizado');
        this.loadTurnos();
      }
    });
  }

  /** 🗑️ Eliminar */
  deleteTurno(turno: Turno) {
    this.turnoService.deleteTurno(turno.id!).subscribe({
      next: () => {
        this.notificationService.success('Turno eliminado');
        this.loadTurnos();
      }
    });
  }
}
