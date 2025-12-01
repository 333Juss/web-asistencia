import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SedeService } from '../../../services/sede.service';
import { Sede } from '../../../../../components/models';
import { NotificationService } from '../../../../../core/services/notification.service';
import { SedeMapComponent } from '../sede-map/sede-map.component';
import { UbicacionSede } from '../../../../../components/models';

@Component({
    selector: 'app-sede-detail',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule,
        MatChipsModule,
        MatProgressSpinnerModule,
        SedeMapComponent
    ],
    templateUrl: './sede-detail.component.html',
    styleUrls: ['./sede-detail.component.scss']
})
export class SedeDetailComponent implements OnInit {

    sede?: Sede;
    sedeUbicacion?: UbicacionSede;
    loading = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private sedeService: SedeService,
        private notificationService: NotificationService
    ) { }

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (id) {
            this.loadSede(id);
        } else {
            this.goBack();
        }
    }

    private loadSede(id: number): void {
        this.loading = true;
        this.sedeService.getSedeById(id).subscribe({
            next: (response) => {
                if (response.success && response.data) {
                    this.sede = response.data;
                    if (this.sede.latitud && this.sede.longitud) {
                        this.sedeUbicacion = {
                            latitud: this.sede.latitud,
                            longitud: this.sede.longitud,
                            radioMetros: this.sede.radioMetros
                        };
                    }
                }
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.notificationService.error('Error al cargar la sede');
                this.goBack();
            }
        });
    }

    goBack(): void {
        this.router.navigate(['/admin/sedes']);
    }

    editSede(): void {
        if (this.sede) {
            this.router.navigate(['/admin/sedes/editar', this.sede.id]);
        }
    }

    formatCoordinates(lat?: number, lng?: number): string {
        if (!lat || !lng) return 'No configurado';
        return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
}
