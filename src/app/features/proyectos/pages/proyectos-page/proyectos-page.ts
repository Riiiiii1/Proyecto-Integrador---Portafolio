import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { StrapiService } from '../../../../core/services/strapi/strapi';
import { CardProyecto } from '../../../../shared/components/card-proyecto/card-proyecto';

@Component({
  selector: 'app-proyectos-page',
  standalone: true,
  imports: [CardProyecto],
  templateUrl: './proyectos-page.html'
})
export class ProyectosPage implements OnInit {
  strapi = inject(StrapiService);

  filtroActivo = signal<string>('todos');

  filtros = ['todos', 'academico', 'personal', 'laboral', 'simulado'];

  proyectosFiltrados = computed(() => {
    if (this.filtroActivo() === 'todos') return this.strapi.proyectos();
    return this.strapi.proyectos().filter(p => p.tipo === this.filtroActivo());
  });

  ngOnInit() {
    this.strapi.cargarTodo();
  }

  setFiltro(filtro: string) {
    this.filtroActivo.set(filtro);
  }
}