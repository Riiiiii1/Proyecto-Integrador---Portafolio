import { ChangeDetectionStrategy, Component, inject, resource, signal, computed } from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';
import { Auth } from '../../../../core/services/auth/auth';
import { Firestore } from '../../../../core/services/firestore/firestore';

@Component({
  selector: 'app-lista-solicitudes-page',
  standalone: true,
  imports: [DatePipe, CommonModule], // <-- Eliminado RouterLink
  templateUrl: './lista-solicitudes-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaSolicitudesPage {
  private firestore = inject(Firestore);
  readonly auth = inject(Auth);

  filtroActivo = signal<'todas' | 'pendientes' | 'respondidas'>('todas');

  solicitudesResource = resource({
    params: () => this.auth.currentUser()?.uid,
    loader: ({ params: uid }) => uid
      ? this.firestore.getSolicitudesDeUsuario(uid)
      : Promise.resolve([])
  });

  solicitudesLista = computed(() => this.solicitudesResource.value() ?? []);

  totalSolicitudes = computed(() => this.solicitudesLista().length);
  totalPendientes = computed(() => this.solicitudesLista().filter(s => s.estado !== 'respondida').length);
  totalRespondidas = computed(() => this.solicitudesLista().filter(s => s.estado === 'respondida').length);

  solicitudesFiltradas = computed(() => {
    const lista = this.solicitudesLista();
    const filtro = this.filtroActivo();
    if (filtro === 'pendientes') return lista.filter(s => s.estado !== 'respondida');
    if (filtro === 'respondidas') return lista.filter(s => s.estado === 'respondida');
    return lista;
  });

  // <-- AQUÍ ESTÁ LA FUNCIÓN QUE FALTABA
  setFiltro(nuevoFiltro: 'todas' | 'pendientes' | 'respondidas') {
    this.filtroActivo.set(nuevoFiltro);
  }

  formatSlug(slug: string): string {
    if (!slug) return '';
    return slug
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }
}