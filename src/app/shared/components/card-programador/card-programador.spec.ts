import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardProgramador } from './card-programador';

describe('CardProgramador', () => {
  let component: CardProgramador;
  let fixture: ComponentFixture<CardProgramador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardProgramador]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardProgramador);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
