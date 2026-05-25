import { Component, input } from '@angular/core';
import { Programador } from '../../../core/models/programador';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-card-programador',
  imports: [RouterLink],
  templateUrl: './card-programador.html',
  styles: ``,
})
export class CardProgramador {
  // Este input required es para recibir el programador desde el homepage.
  // Este es para asegurar que el componente siempre reciba al menos un programador.
  // Es de tipo Programador del Interfaz.
  programador = input.required<Programador>();
}
