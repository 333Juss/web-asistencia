// import { NgModule, Optional, SkipSelf } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

// // Services
// import { StorageService } from './services/storage.service';
// import { NotificationService } from './services/notification.service';
// import { GeolocationService } from './services/geolocation.service';
// import { LoadingService } from './services/loading.service';
// import { loadingInterceptorFn } from './interceptors/loading.interceptor';
// import { authInterceptorFn } from './interceptors/auth.interceptor';
// import { errorInterceptorFn } from './interceptors/error.interceptor';

// // Guards (se crearán después)
// // import { AuthGuard } from './guards/auth.guard';
// // import { RoleGuard } from './guards/role.guard';

// // Interceptors


// @NgModule({
//     declarations: [],
//     imports: [
//         CommonModule,
//         HttpClientModule
//     ],
//     providers: [
//         // Services
//         StorageService,
//         NotificationService,
//         GeolocationService,
//         LoadingService,

//         // Guards
//         // AuthGuard,
//         // RoleGuard,

//         // Interceptors - orden importante: Loading -> Auth -> Error
//         {
//             provide: HTTP_INTERCEPTORS,
//             useClass: loadingInterceptorFn,
//             multi: true
//         },
//         {
//             provide: HTTP_INTERCEPTORS,
//             useClass: authInterceptorFn,
//             multi: true
//         },
//         {
//             provide: HTTP_INTERCEPTORS,
//             useClass: errorInterceptorFn,
//             multi: true
//         }
//     ]
// })
// export class CoreModule {
//     // Prevenir reimportación del CoreModule
//     constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
//         if (parentModule) {
//             throw new Error('CoreModule ya ha sido cargado. Importa CoreModule solo en AppModule.');
//         }
//     }
// }