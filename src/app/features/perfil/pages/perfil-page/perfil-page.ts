import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { StrapiService } from '../../../../core/services/strapi/strapi';
import { CardProyecto } from '../../../../shared/components/card-proyecto/card-proyecto';

@Component({
  selector: 'app-perfil-page',
  imports: [RouterLink, CardProyecto],
  templateUrl: './perfil-page.html',
})
export class PerfilPage {
  private route = inject(ActivatedRoute);
  private strapiService = inject(StrapiService);

  slug = signal<string>(this.route.snapshot.params['slug']);

  constructor() {
    this.route.params.subscribe(params => this.slug.set(params['slug']));
  }

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

  programador = computed(() =>
    (this.programadoresResource.value() ?? []).find(p => p.slug === this.slug())
  );

  proyectos = computed(() =>
    (this.proyectosResource.value() ?? []).filter(p =>
      p.programadores.includes(this.programador()?.id ?? -1)
    )
  );

  getIcono(tech: string): string {
    const iconos: Record<string, string> = {
      'Angular':     'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
      'TypeScript':  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
      'Tailwind':    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg',
      'Firebase':    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg',
      'Strapi':      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/strapi/strapi-original.svg',
      'Spring Boot': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg',
      'Java':        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
      'PostgreSQL':  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
      'Docker':      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
      'Node':        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
    };
    return iconos[tech] ?? '';
  }
}