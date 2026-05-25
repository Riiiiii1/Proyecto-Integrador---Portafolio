import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StrapiService } from '../../../../core/services/strapi/strapi';
import { CardProyecto } from '../../../../shared/components/card-proyecto/card-proyecto';

@Component({
  selector: 'app-perfil-page',
  imports: [RouterLink, CardProyecto],
  templateUrl: './perfil-page.html',
  styles: ``,
})
export class PerfilPage implements OnInit {
  private route = inject(ActivatedRoute);
  strapi = inject(StrapiService);
  // El slug del programador se obtiene de la URL
  slug = signal<string>('');
  // Computed para obtener el programador actual según el slug
  programador = computed(() =>
    this.strapi.programadores().find(p => p.slug === this.slug())
  );
  // Computed para obtener los proyectos del programador actual
  proyectos = computed(() =>
    this.strapi.proyectos().filter(p =>
      // Verificar si el programador actual esta en la lista del ts .
      p.programadores.includes(this.programador()?.id ?? -1)
    )
  );
// Con ngOnInit cargas los datos de strapi y tambien se suscribe a los cambios en la URL.
  ngOnInit() {
    this.strapi.cargarTodo();
    this.route.params.subscribe(params => {
      this.slug.set(params['slug']);
    });
  }

  getIcono(tech: string): string {
    // MAPEO DE TECONOLIGIAS CREADO POR EL GEMINI
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
