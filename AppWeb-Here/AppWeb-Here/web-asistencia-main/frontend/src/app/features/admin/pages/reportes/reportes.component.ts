import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ColaboradorService } from '../../services/colaborador.service';
import { ColaboradorListItem } from '../../../../components/models';
import { NotificationService } from '../../../../core/services/notification.service';

interface ReportDto {
    colaboradorId: number;
    nombreColaborador: string;
    nombreSede: string;
    diasTrabajados: number;
    totalHorasTrabajadas: number;
    llegadasTarde: number;
    faltas: number;
}

@Component({
    selector: 'app-reportes',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './reportes.component.html',
    styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit {

    filterForm: FormGroup;
    colaboradores: ColaboradorListItem[] = [];
    reportData: ReportDto[] = [];
    loading = false;
    displayedColumns: string[] = ['colaborador', 'sede', 'dias', 'horas', 'tardanzas', 'faltas'];

    constructor(
        private fb: FormBuilder,
        private http: HttpClient,
        private colaboradorService: ColaboradorService,
        private notificationService: NotificationService
    ) {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        this.filterForm = this.fb.group({
            startDate: [startOfMonth],
            endDate: [today],
            colaboradorId: [null]
        });
    }

    ngOnInit(): void {
        this.loadColaboradores();
        this.generateReport();
    }

    loadColaboradores(): void {
        this.colaboradorService.getColaboradores().subscribe({
            next: (response) => {
                if (response.success && response.data) {
                    this.colaboradores = response.data.content;
                }
            }
        });
    }

    generateReport(): void {
        this.loading = true;
        const { startDate, endDate, colaboradorId } = this.filterForm.value;

        let params = new HttpParams()
            .set('startDate', this.formatDate(startDate))
            .set('endDate', this.formatDate(endDate));

        if (colaboradorId) {
            params = params.set('colaboradorId', colaboradorId);
        }

        this.http.get<any>('http://localhost:8080/api/reports/attendance', { params }).subscribe({
            next: (response) => {
                if (response.success) {
                    this.reportData = response.data;
                }
                this.loading = false;
            },
            error: (err) => {
                this.loading = false;
                this.notificationService.error('Error al generar el reporte');
            }
        });
    }

    private formatDate(date: Date): string {
        if (!date) return '';
        const d = new Date(date);
        return d.toISOString().split('T')[0];
    }

    formatHoras(horas: number): string {
        return horas.toFixed(2) + ' h';
    }
}
