import { ChangeDetectionStrategy, Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StrapiService } from '../../../../core/services/strapi/strapi';
import { Auth } from '../../../../core/services/auth/auth';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-lista-solicitudes-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-solicitudes-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaSolicitudesPage implements OnInit {
  private strapi = inject(StrapiService);
  private auth = inject(Auth);

  // Almacena la lista maestra de solicitudes
  solicitudesEnviadas = signal<any[]>([]);
  cargandoDatos = signal(true);

  // =========================================================================
  // SISTEMA DE TABLERO: ESTADO Y CONTADORES
  // =========================================================================
  filtroActivo = signal<'todas' | 'pendientes' | 'respondidas'>('todas');

  totalSolicitudes = computed(() => this.solicitudesEnviadas().length);
  totalPendientes = computed(() => this.solicitudesEnviadas().filter(s => s.estado !== 'respondida').length);
  totalRespondidas = computed(() => this.solicitudesEnviadas().filter(s => s.estado === 'respondida').length);

  // =========================================================================
  // LISTA FILTRADA PARA EL HTML
  // =========================================================================
  solicitudesFiltradas = computed(() => {
    const lista = this.solicitudesEnviadas();
    const filtro = this.filtroActivo();
    
    if (filtro === 'pendientes') return lista.filter(s => s.estado !== 'respondida');
    if (filtro === 'respondidas') return lista.filter(s => s.estado === 'respondida');
    return lista; // Si es 'todas'
  });

  ngOnInit() {
    const correoUsuario = this.auth.currentUser()?.email;

    if (correoUsuario) {
      this.strapi.getSolicitudesDeCliente(correoUsuario).subscribe({
        next: (datos) => {
          this.solicitudesEnviadas.set(datos || []);
          this.cargandoDatos.set(false);

          // Lógica de marcado automático de lectura
          const pendientesDeLectura = (datos || []).filter(
            (s) => s.estado === 'respondida' && s.leido === false
          );

          if (pendientesDeLectura.length > 0) {
            const tareasActualizacion = pendientesDeLectura.map((solicitud) =>
              this.strapi.actualizarSolicitud(solicitud.id, { leido: true })
            );

            forkJoin(tareasActualizacion).subscribe({
              next: () => {
                this.solicitudesEnviadas.update((lista) =>
                  lista.map((s) => (s.estado === 'respondida' ? { ...s, leido: true } : s))
                );
              },
              error: (err) => console.error('Error al cambiar bandera de lectura:', err)
            });
          }
        },
        error: (err) => {
          console.error('Error al recuperar las solicitudes:', err);
          this.cargandoDatos.set(false);
        }
      });
    } else {
      this.cargandoDatos.set(false);
    }
  }

  // Método para actualizar el botón de filtro
  setFiltro(nuevoFiltro: 'todas' | 'pendientes' | 'respondidas') {
    this.filtroActivo.set(nuevoFiltro);
  }
}