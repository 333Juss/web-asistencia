import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { TurnoService } from '../../../services/turno.service';
import { Turno } from '../../../../../components/models';
import { NotificationService } from '../../../../../core/services/notification.service';

// Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-turno-detail',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatIconModule,
    MatChipsModule, MatButtonModule, MatDividerModule, MatProgressSpinnerModule
  ],
  templateUrl: './turno-detail.component.html',
  styleUrls: ['./turno-detail.component.scss']
})
export class TurnoDetailComponent implements OnInit {

  turno?: Turno;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private turnoService: TurnoService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.load(id);
  }

  load(id: number) {
    this.loading = true;
    this.turnoService.getTurnoById(id).subscribe({
      next: res => {
        this.turno = res.data;
        this.loading = false;
      },
      error: () => {
        this.notify.error('No se pudo cargar el turno');
        this.router.navigate(['/admin/turnos']);
        this.loading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/admin/turnos']);
  }

  editTurno() {
    if (this.turno)
      this.router.navigate(['/admin/turnos/editar', this.turno.id]);
  }
}
