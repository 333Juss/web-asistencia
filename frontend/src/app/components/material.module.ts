import { NgModule } from '@angular/core';

// Layout
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';

// Buttons & Indicators
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';

// Forms
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';

// Navigation
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatStepperModule } from '@angular/material/stepper';

// Popups & Modals
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';

// Data Tables
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

// Cards
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';

// Others
import { MatRippleModule } from '@angular/material/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

// Custom Paginator Labels in Spanish
export class CustomPaginatorIntl extends MatPaginatorIntl {
    override itemsPerPageLabel = 'Elementos por página:';
    override nextPageLabel = 'Página siguiente';
    override previousPageLabel = 'Página anterior';
    override firstPageLabel = 'Primera página';
    override lastPageLabel = 'Última página';

    override getRangeLabel = (page: number, pageSize: number, length: number): string => {
        if (length === 0 || pageSize === 0) {
            return `0 de ${length}`;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        const endIndex = startIndex < length ?
            Math.min(startIndex + pageSize, length) :
            startIndex + pageSize;
        return `${startIndex + 1} - ${endIndex} de ${length}`;
    };
}

const materialModules = [
    // Layout
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatGridListModule,
    MatDividerModule,

    // Buttons & Indicators
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,

    // Forms
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,

    // Navigation
    MatMenuModule,
    MatTabsModule,
    MatStepperModule,

    // Popups & Modals
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatBottomSheetModule,

    // Data Tables
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,

    // Cards
    MatCardModule,
    MatExpansionModule,

    // Others
    MatRippleModule,
    MatButtonToggleModule
];

@NgModule({
    imports: materialModules,
    exports: materialModules,
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'es-PE' },
        { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }
    ]
})
export class MaterialModule { }