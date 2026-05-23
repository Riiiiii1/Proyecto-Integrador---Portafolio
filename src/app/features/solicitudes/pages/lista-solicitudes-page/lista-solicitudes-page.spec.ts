import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaSolicitudesPage } from './lista-solicitudes-page';

describe('ListaSolicitudesPage', () => {
  let component: ListaSolicitudesPage;
  let fixture: ComponentFixture<ListaSolicitudesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaSolicitudesPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaSolicitudesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
