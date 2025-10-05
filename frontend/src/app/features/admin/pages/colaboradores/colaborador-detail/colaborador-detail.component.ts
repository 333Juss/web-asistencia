import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { ColaboradorService } from '../../../services/colaborador.service';
import { Colaborador } from '../../../../../components/models';
import { NotificationService } from '../../../../../core/services/notification.service';

@Component({
    selector: 'app-colaborador-detail',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule,
        MatChipsModule,
        MatProgressSpinnerModule,
        MatTabsModule
    ],
    templateUrl: './colaborador-detail.component.html',
    styleUrls: ['./colaborador-detail.component.scss']
})
export class ColaboradorDetailComponent implements OnInit {

    colaborador?: Colaborador;
    loading = false;
    colaboradorId!: number;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private colaboradorService: ColaboradorService,
        private notificationService: NotificationService
    ) { }

    ngOnInit(): void {
        this.colaboradorId = Number(this.route.snapshot.paramMap.get('id'));
        if (this.colaboradorId) {
            this.loadColaborador();
        }
    }

    /**
     * Carga los datos del colaborador
     */
    loadColaborador(): void {
        this.loading = true;
        this.colaboradorService.getColaboradorById(this.colaboradorId).subscribe({
            next: (response) => {
                if (response.success && response.data) {
                    this.colaborador = response.data;
                }
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.notificationService.error('Error al cargar el colaborador');
                this.goBack();
            }
        });
    }

    /**
     * Navega a editar
     */
    editColaborador(): void {
        this.router.navigate(['/admin/colaboradores/editar', this.colaboradorId]);
    }

    /**
     * Vuelve a la lista
     */
    goBack(): void {
        this.router.navigate(['/admin/colaboradores']);
    }

    /**
     * Formatea la fecha
     */
    formatDate(date: Date | undefined): string {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('es-PE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    /**
     * Calcula la edad
     */
    calculateAge(birthDate: Date | undefined): number | null {
        if (!birthDate) return null;
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    }
}