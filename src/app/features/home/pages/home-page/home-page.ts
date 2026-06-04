import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { StrapiService } from '../../../../core/services/strapi/strapi';
import { Auth } from '../../../../core/services/auth/auth';
import { Hero } from '../../components/hero/hero';
import { CardProgramador } from '../../../../shared/components/card-programador/card-programador';
import { CardProyecto } from '../../../../shared/components/card-proyecto/card-proyecto';

@Component({
  selector: 'app-home-page',
  imports: [Hero, CardProgramador, CardProyecto, RouterLink],
  templateUrl: './home-page.html',
})
export class HomePage {
  private strapiService = inject(StrapiService);
  auth = inject(Auth);

  programadoresResource = rxResource({
    stream: () => this.strapiService.getProgramadores().pipe(
      map(res => res.data.map(p => this.strapiService.mapProgramador(p)))
    ),
  });

  proyectosResource = rxResource({
    stream: () => this.strapiService.getProyectos().pipe(
      map(res => res.data.map(p => this.strapiService.mapProyecto(p)))
    ),
  });

  serviciosResource = rxResource({
    stream: () => this.strapiService.getServicios().pipe(
      map(res => res.data.map(s => this.strapiService.mapServicio(s)))
    ),
  });

  destacados = computed(() =>
    (this.proyectosResource.value() ?? []).filter(p => p.destacado)
  );

  proyectosFiltrados = computed(() => {
    const proyectos = this.proyectosResource.value() ?? [];
    const programadores = this.programadoresResource.value() ?? [];

    if (!this.auth.isLoggedIn()) return proyectos;

    if (this.auth.isProgramador()) {
      const yo = programadores.find(p => p.correo === this.auth.currentUser()?.email);
      return yo ? proyectos.filter(p => p.programadores.includes(yo.id)) : [];
    }

    return proyectos;
  });
}