import { Component, inject, signal, computed } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { StrapiService } from '../../../../core/services/strapi/strapi';
import { CardProyecto } from '../../../../shared/components/card-proyecto/card-proyecto';

@Component({
  selector: 'app-proyectos-page',
  imports: [CardProyecto],
  templateUrl: './proyectos-page.html'
})
export class ProyectosPage {
  private strapiService = inject(StrapiService);

  filtroActivo = signal<string>('todos');
  filtros = ['todos', 'academico', 'personal', 'laboral', 'simulado'];

  proyectosResource = rxResource({
    stream: () => this.strapiService.getProyectos().pipe(
      map(res => res.data.map(p => this.strapiService.mapProyecto(p)))
    ),
  });

  programadoresResource = rxResource({
    stream: () => this.strapiService.getProgramadores().pipe(
      map(res => res.data.map(p => this.strapiService.mapProgramador(p)))
    ),
  });

  proyectosFiltrados = computed(() => {
    const proyectos = this.proyectosResource.value() ?? [];
    if (this.filtroActivo() === 'todos') return proyectos;
    return proyectos.filter(p => p.tipo === this.filtroActivo());
  });

  setFiltro(filtro: string) {
    this.filtroActivo.set(filtro);
  }
}