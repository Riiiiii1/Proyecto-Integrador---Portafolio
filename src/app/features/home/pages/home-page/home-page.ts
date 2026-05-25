import { Component ,OnInit, inject } from '@angular/core';
import { StrapiService } from '../../../../core/services/strapi/strapi';
import { Hero } from '../../components/hero/hero';
import { CardProgramador } from '../../../../shared/components/card-programador/card-programador';
import { CardProyecto } from '../../../../shared/components/card-proyecto/card-proyecto';
import { ɵEmptyOutletComponent } from "@angular/router";
@Component({
  selector: 'app-home-page',
  imports: [Hero, CardProgramador, CardProyecto, ɵEmptyOutletComponent],
  templateUrl: './home-page.html',
  styles: ``,
})
export class HomePage implements OnInit {
 strapi = inject(StrapiService);
   ngOnInit() {
    this.strapi.cargarTodo();
  }
}
