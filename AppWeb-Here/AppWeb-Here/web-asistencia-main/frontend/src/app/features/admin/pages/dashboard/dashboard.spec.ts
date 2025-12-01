import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Dashboard } from './dashboard';
import { DashboardService } from '../../services/dashboard.service';
import { of } from 'rxjs';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;
  let dashboardServiceMock: any;

  beforeEach(async () => {
    dashboardServiceMock = {
      getStats: jasmine.createSpy('getStats').and.returnValue(of({
        success: true,
        data: {
          totalColaboradores: 10,
          asistenciasCount: 5,
          tardanzasCount: 1,
          ausenciasCount: 4,
          asistenciaPorEstado: { "A Tiempo": 4, "Tardanzas": 1, "Ausencias": 4 },
          asistenciaPorDia: { "2023-10-01": 5 }
        }
      }))
    };

    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        { provide: DashboardService, useValue: dashboardServiceMock },
        provideCharts(withDefaultRegisterables())
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
