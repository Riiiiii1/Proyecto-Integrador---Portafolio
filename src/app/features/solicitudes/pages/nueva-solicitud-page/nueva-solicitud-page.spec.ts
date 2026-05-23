import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaSolicitudPage } from './nueva-solicitud-page';

describe('NuevaSolicitudPage', () => {
  let component: NuevaSolicitudPage;
  let fixture: ComponentFixture<NuevaSolicitudPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevaSolicitudPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevaSolicitudPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
