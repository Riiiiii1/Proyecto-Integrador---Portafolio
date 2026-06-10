import { Programador } from '../../../core/models/programador';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-card-programador',
  imports: [RouterLink],
  templateUrl: './card-programador.html',
  styles: ``,
})
export class CardProgramador {
  programador = input.required<Programador>();
}