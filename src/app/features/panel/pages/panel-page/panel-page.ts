import { Component, inject, signal, computed, resource } from '@angular/core';
import { DatePipe } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { from } from 'rxjs';
import { Auth } from '../../../../core/services/auth/auth';
import { Firestore } from '../../../../core/services/firestore/firestore';
import { Solicitud } from '../../../../core/models/solicitud';
import { StrapiService } from '../../../../core/services/strapi/strapi';
import { map } from 'rxjs';
@Component({
  selector: 'app-panel-page',
  imports: [DatePipe],
  templateUrl: './panel-page.html'
})
export class PanelPage {
  private strapiService = inject(StrapiService);
  readonly auth      = inject(Auth);
  private firestore  = inject(Firestore);

  solicitudSeleccionada = signal<Solicitud | null>(null);
  filtroEstado = signal<'todas' | 'pendiente' | 'respondida'>('todas');
  respuesta    = signal('');
  guardando    = signal(false);

solicitudesResource = resource({
  params: () => this.auth.currentUser()?.email,
  loader: async ({ params: email }) => {
    if (!email) return [];
    
    // Busca el slug del programador logueado en Strapi
    const res = await this.strapiService.getProgramadores().pipe(
      map(r => r.data.map(p => this.strapiService.mapProgramador(p)))
    ).toPromise();
    
    const yo = res?.find(p => p.correo === email);
    if (!yo) return [];
    
    return this.firestore.getSolicitudesDeProgramador(yo.slug);
  }
});

  solicitudesFiltradas = computed(() => {
    const todas = this.solicitudesResource.value() ?? [];
    if (this.filtroEstado() === 'todas') return todas;
    return todas.filter(s => s.estado === this.filtroEstado());
  });

  totalPendientes = computed(() =>
    (this.solicitudesResource.value() ?? []).filter(s => s.estado === 'pendiente').length
  );

  totalRespondidas = computed(() =>
    (this.solicitudesResource.value() ?? []).filter(s => s.estado === 'respondida').length
  );

  seleccionar(solicitud: Solicitud) {
    this.solicitudSeleccionada.set(solicitud);
    this.respuesta.set(solicitud.observacion ?? '');
  }

  cerrarDetalle() {
    this.solicitudSeleccionada.set(null);
    this.respuesta.set('');
  }

  async guardarRespuesta() {
    const s = this.solicitudSeleccionada();
    if (!s?.id) return;

    this.guardando.set(true);
    try {
      await this.firestore.actualizarSolicitud(s.id, {
        estado:      'respondida',
        observacion: this.respuesta(),
      });
      this.solicitudesResource.reload();
      this.cerrarDetalle();
    } finally {
      this.guardando.set(false);
    }
  }

  setFiltro(f: 'todas' | 'pendiente' | 'respondida') {
    this.filtroEstado.set(f);
  }
}