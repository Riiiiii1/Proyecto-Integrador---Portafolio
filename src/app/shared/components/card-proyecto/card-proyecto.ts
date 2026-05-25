import { Component,input } from '@angular/core';
import { Proyecto } from '../../../core/models/proyecto';
import { Programador } from '../../../core/models/programador';

@Component({
  selector: 'app-card-proyecto',
  imports: [],
  templateUrl: './card-proyecto.html',
  styles: ``,
})
export class CardProyecto {
   proyecto = input.required<Proyecto>();
  programadores = input.required<Programador[]>();

  getProgramadores() {
    return this.programadores();
  }
}
