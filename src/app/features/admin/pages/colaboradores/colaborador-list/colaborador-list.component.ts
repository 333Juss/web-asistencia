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
import { ColaboradorService } from '../../../services/colaborador.service';
import { debounceTime, Subject } from 'rxjs';
import { ColaboradorListItem, FilterRequest } from '../../../../../components/models';
import { ConfirmDialogService } from '../../../../../shared/services/confirm-dialog.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // ← AGREGAR
import { MatDividerModule } from '@angular/material/divider';

@Component({
    selector: 'app-colaborador-list',
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
        MatProgressSpinnerModule, // ← AGREGAR
        MatDividerModule
    ],
    templateUrl: './colaborador-list.component.html',
    styleUrls: ['./colaborador-list.component.scss']
})
export class ColaboradorListComponent implements OnInit {

    displayedColumns: string[] = ['dni', 'nombreCompleto', 'email', 'cargo', 'sede', 'biometrico', 'estado', 'acciones'];
    dataSource = new MatTableDataSource<ColaboradorListItem>();

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    loading = false;
    totalElements = 0;
    pageSize = 10;
    currentPage = 0;
    searchTerm = '';
    private searchSubject = new Subject<string>();

    constructor(
        private colaboradorService: ColaboradorService,
        private confirmDialogService: ConfirmDialogService,
        private notificationService: NotificationService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadColaboradores();
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
            this.loadColaboradores();
        });
    }

    /**
     * Carga la lista de colaboradores
     */
    loadColaboradores(): void {
        this.loading = true;

        const filterRequest: FilterRequest = {
            page: this.currentPage,
            size: this.pageSize,
            search: this.searchTerm,
            sort: this.sort?.active ? [`${this.sort.active},${this.sort.direction}`] : []
        };

        this.colaboradorService.getColaboradores(filterRequest).subscribe({
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
        this.loadColaboradores();
    }

    /**
     * Maneja el cambio de ordenamiento
     */
    onSortChange(): void {
        this.currentPage = 0;
        this.loadColaboradores();
    }

    /**
     * Maneja la búsqueda
     */
    onSearch(searchTerm: string): void {
        this.searchSubject.next(searchTerm);
    }

    /**
     * Navega al formulario de nuevo colaborador
     */
    addColaborador(): void {
        this.router.navigate(['/admin/colaboradores/nuevo']);
    }

    /**
     * Navega al detalle del colaborador
     */
    viewColaborador(id: number): void {
        this.router.navigate(['/admin/colaboradores', id]);
    }

    /**
     * Navega al formulario de edición
     */
    editColaborador(id: number): void {
        this.router.navigate(['/admin/colaboradores/editar', id]);
    }

    /**
     * Elimina un colaborador
     */
    deleteColaborador(colaborador: ColaboradorListItem): void {
        this.confirmDialogService.confirmDelete(colaborador.nombreCompleto).subscribe(confirmed => {
            if (confirmed) {
                this.colaboradorService.deleteColaborador(colaborador.id).subscribe({
                    next: (response) => {
                        if (response.success) {
                            this.notificationService.success('Colaborador eliminado correctamente');
                            this.loadColaboradores();
                        }
                    }
                });
            }
        });
    }

    /**
     * Cambia el estado activo/inactivo
     */
    toggleStatus(colaborador: ColaboradorListItem): void {
        const newStatus = !colaborador.activo;
        const message = newStatus ? 'activar' : 'desactivar';

        this.confirmDialogService.confirm(
            'Cambiar estado',
            `¿Estás seguro de ${message} a ${colaborador.nombreCompleto}?`
        ).subscribe(confirmed => {
            if (confirmed) {
                this.colaboradorService.toggleColaboradorStatus(colaborador.id, newStatus).subscribe({
                    next: (response) => {
                        if (response.success) {
                            this.notificationService.success(`Colaborador ${message}do correctamente`);
                            this.loadColaboradores();
                        }
                    }
                });
            }
        });
    }

    /**
     * Exporta a Excel
     */
    exportToExcel(): void {
        this.notificationService.info('Generando archivo Excel...');
        this.colaboradorService.exportToExcel().subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `colaboradores_${new Date().getTime()}.xlsx`;
                link.click();
                window.URL.revokeObjectURL(url);
                this.notificationService.success('Archivo descargado correctamente');
            }
        });
    }

    /**
     * Limpia los filtros
     */
    clearFilters(): void {
        this.searchTerm = '';
        this.currentPage = 0;
        this.loadColaboradores();
    }
}