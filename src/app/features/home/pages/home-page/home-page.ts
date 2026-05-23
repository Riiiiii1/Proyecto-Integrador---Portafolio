import { Component ,OnInit, inject } from '@angular/core';
import { StrapiService } from '../../../../core/services/strapi/strapi';
import { Hero } from '../../components/hero/hero';
@Component({
  selector: 'app-home-page',
  imports: [Hero],
  templateUrl: './home-page.html',
  styles: ``,
})
export class HomePage implements OnInit {
 strapi = inject(StrapiService);
   ngOnInit() {
    this.strapi.cargarTodo();
  }
}
