import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { SedeService } from '../../../services/sede.service';
import { debounceTime, Subject } from 'rxjs';
import { FilterRequest, Sede } from '../../../../../components/models';
import { ConfirmDialogService } from '../../../../../shared/services/confirm-dialog.service';
import { NotificationService } from '../../../../../core/services/notification.service';

@Component({
    selector: 'app-sede-list',
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
        MatCardModule
    ],
    templateUrl: './sede-list.component.html',
    styleUrls: ['./sede-list.component.scss']
})
export class SedeListComponent implements OnInit {

    displayedColumns: string[] = ['codigo', 'nombre', 'direccion', 'ubicacion', 'radio', 'empleados', 'estado', 'acciones'];
    dataSource = new MatTableDataSource<Sede>();

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    loading = false;
    totalElements = 0;
    pageSize = 10;
    currentPage = 0;
    searchTerm = '';
    private searchSubject = new Subject<string>();

    constructor(
        private sedeService: SedeService,
        private confirmDialogService: ConfirmDialogService,
        private notificationService: NotificationService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadSedes();
        this.setupSearch();
    }

    /**
     * Configura la búsqueda con debounce
     */
    private setupSearch(): void {
        this.searchSubject.pipe(
            debounceTime(500)
        ).subscribe(searchTerm => {
            this.searchTerm = searchTerm;
            this.currentPage = 0;
            this.loadSedes();
        });
    }

    /**
     * Carga la lista de sedes
     */
    loadSedes(): void {
        this.loading = true;

        const filterRequest: FilterRequest = {
            page: this.currentPage,
            size: this.pageSize,
            search: this.searchTerm,
            sort: this.sort?.active ? [`${this.sort.active},${this.sort.direction}`] : []
        };

        this.sedeService.getSedes(filterRequest).subscribe({
            next: (response) => {
                if (response.success && response.data) {
                    this.dataSource.data = response.data.content;
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
     * Maneja el cambio de página
     */
    onPageChange(event: PageEvent): void {
        this.currentPage = event.pageIndex;
        this.pageSize = event.pageSize;
        this.loadSedes();
    }

    /**
     * Maneja el cambio de ordenamiento
     */
    onSortChange(): void {
        this.currentPage = 0;
        this.loadSedes();
    }

    /**
     * Maneja la búsqueda
     */
    onSearch(searchTerm: string): void {
        this.searchSubject.next(searchTerm);
    }

    /**
     * Navega al formulario de nueva sede
     */
    addSede(): void {
        this.router.navigate(['/admin/sedes/nueva']);
    }

    /**
     * Navega al detalle de la sede
     */
    viewSede(id: number): void {
        this.router.navigate(['/admin/sedes', id]);
    }

    /**
     * Navega al formulario de edición
     */
    editSede(id: number): void {
        this.router.navigate(['/admin/sedes/editar', id]);
    }

    /**
     * Elimina una sede
     */
    deleteSede(sede: Sede): void {
        this.confirmDialogService.confirmDelete(sede.nombre).subscribe(confirmed => {
            if (confirmed) {
                this.sedeService.deleteSede(sede.id!).subscribe({
                    next: (response) => {
                        if (response.success) {
                            this.notificationService.success('Sede eliminada correctamente');
                            this.loadSedes();
                        }
                    }
                });
            }
        });
    }

    /**
     * Cambia el estado activo/inactivo
     */
    toggleStatus(sede: Sede): void {
        const newStatus = !sede.activo;
        const message = newStatus ? 'activar' : 'desactivar';

        this.confirmDialogService.confirm(
            'Cambiar estado',
            `¿Estás seguro de ${message} la sede ${sede.nombre}?`
        ).subscribe(confirmed => {
            if (confirmed) {
                this.sedeService.toggleSedeStatus(sede.id!, newStatus).subscribe({
                    next: (response) => {
                        if (response.success) {
                            this.notificationService.success(`Sede ${message}da correctamente`);
                            this.loadSedes();
                        }
                    }
                });
            }
        });
    }

    /**
     * Formatea las coordenadas
     */
    formatCoordinates(lat?: number, lng?: number): string {
        if (!lat || !lng) return 'No configurado';
        return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }

    /**
     * Limpia los filtros
     */
    clearFilters(): void {
        this.searchTerm = '';
        this.currentPage = 0;
        this.loadSedes();
    }
}