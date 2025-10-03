import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';
import { LoadingService } from '../../core/services/loading.service';

@Component({
    selector: 'app-loading-spinner',
    standalone: true,
    imports: [
        CommonModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './loading-spinner.component.html',
    styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent {
    loading$: Observable<boolean>;

    constructor(private loadingService: LoadingService) {
        this.loading$ = this.loadingService.loading$;
    }
}