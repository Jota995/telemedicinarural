import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialMedicoComponent } from './historial-medico.component';

describe('HistorialMedicoComponent', () => {
  let component: HistorialMedicoComponent;
  let fixture: ComponentFixture<HistorialMedicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialMedicoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistorialMedicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
