import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnoCreateDialog } from './turno-create-dialog';

describe('TurnoCreateDialog', () => {
  let component: TurnoCreateDialog;
  let fixture: ComponentFixture<TurnoCreateDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurnoCreateDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TurnoCreateDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
