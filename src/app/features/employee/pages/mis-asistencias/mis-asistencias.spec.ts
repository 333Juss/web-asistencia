import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisAsistencias } from './mis-asistencias';

describe('MisAsistencias', () => {
  let component: MisAsistencias;
  let fixture: ComponentFixture<MisAsistencias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisAsistencias]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisAsistencias);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
