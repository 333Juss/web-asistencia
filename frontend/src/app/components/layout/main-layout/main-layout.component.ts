import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterComponent } from '../footer/footer.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatSidenavModule,
        HeaderComponent,
        SidebarComponent,
        FooterComponent
    ],
    templateUrl: './main-layout.component.html',
    styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {

    isHandset$: Observable<boolean>; // Solo declarar, no inicializar

    constructor(private breakpointObserver: BreakpointObserver) {
        // Inicializar en el constructor
        this.isHandset$ = this.breakpointObserver
            .observe([Breakpoints.Handset, Breakpoints.Tablet])
            .pipe(
                map(result => result.matches),
                shareReplay()
            );
    }
}