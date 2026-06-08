import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';           // ← añadir
import { StrapiService } from '../../../../core/services/strapi/strapi';
import { Hero } from '../../components/hero/hero';
import { CardProgramador } from '../../../../shared/components/card-programador/card-programador';
import { CardProyecto } from '../../../../shared/components/card-proyecto/card-proyecto';
import { RouterLink } from '@angular/router';       // ← añadir

@Component({
  selector: 'app-home-page',
  imports: [Hero, CardProgramador, CardProyecto],
  templateUrl: './home-page.html',
  styles: ``,
})
export class HomePage implements OnInit {
  strapi = inject(StrapiService);
  private router = inject(Router);                  // ← añadir

  ngOnInit() {
    this.strapi.cargarTodo();
  }

  irALogin() {                                      // ← añadir
    this.router.navigate(['/login']);
  }
}