import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Material Module
import { MaterialModule } from './material.module';

// Components (se agregarán más adelante)
// import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
// import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
// import { CameraCaptureComponent } from './components/camera-capture/camera-capture.component';

// Directives
// import { ClickStopPropagationDirective } from './directives/click-stop-propagation.directive';

// Pipes
// import { TimeFormatPipe } from './pipes/time-format.pipe';
// import { HoursWorkedPipe } from './pipes/hours-worked.pipe';

@NgModule({
    declarations: [
        // Components
        // LoadingSpinnerComponent,
        // ConfirmDialogComponent,
        // CameraCaptureComponent,

        // Directives
        // ClickStopPropagationDirective,

        // Pipes
        // TimeFormatPipe,
        // HoursWorkedPipe
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        MaterialModule
    ],
    exports: [
        // Angular Modules
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,

        // Material Module
        MaterialModule,

        // Components
        // LoadingSpinnerComponent,
        // ConfirmDialogComponent,
        // CameraCaptureComponent,

        // Directives
        // ClickStopPropagationDirective,

        // Pipes
        // TimeFormatPipe,
        // HoursWorkedPipe
    ]
})
export class SharedModule { }