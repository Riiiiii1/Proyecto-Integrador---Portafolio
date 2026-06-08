import { ChangeDetectionStrategy, Component, inject, OnInit, OnDestroy, signal, computed } from '@angular/core';
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
export class ListaSolicitudesPage implements OnInit, OnDestroy {
  private strapi = inject(StrapiService);
  private auth = inject(Auth);
  private intervaloId: any;

  solicitudesEnviadas = signal<any[]>([]);
  cargandoDatos = signal(true);
  filtroActivo = signal<'todas' | 'pendientes' | 'respondidas'>('todas');

  totalSolicitudes = computed(() => this.solicitudesEnviadas().length);
  totalPendientes = computed(() => this.solicitudesEnviadas().filter(s => s.estado !== 'respondida').length);
  totalRespondidas = computed(() => this.solicitudesEnviadas().filter(s => s.estado === 'respondida').length);

  solicitudesFiltradas = computed(() => {
    const lista = this.solicitudesEnviadas();
    const filtro = this.filtroActivo();
    if (filtro === 'pendientes') return lista.filter(s => s.estado !== 'respondida');
    if (filtro === 'respondidas') return lista.filter(s => s.estado === 'respondida');
    return lista;
  });

  ngOnInit() {
    this.cargarDatos(true);
    
    // Temporizador: Refresca cada 3 segundos sin mostrar loading
    this.intervaloId = setInterval(() => {
      this.cargarDatos(false);
    }, 3000);
  }

  ngOnDestroy() {
    if (this.intervaloId) clearInterval(this.intervaloId);
  }

  cargarDatos(mostrarLoading: boolean) {
    const correoUsuario = this.auth.currentUser()?.email;
    if (!correoUsuario) {
      this.cargandoDatos.set(false);
      return;
    }

    if (mostrarLoading) this.cargandoDatos.set(true);

    this.strapi.getSolicitudesDeCliente(correoUsuario).subscribe({
      next: (datos) => {
        this.solicitudesEnviadas.set(datos || []);
        this.cargandoDatos.set(false);

        // Lógica de marcado automático
        const pendientesDeLectura = (datos || []).filter(
          (s) => s.estado === 'respondida' && s.leido === false
        );

        if (pendientesDeLectura.length > 0) {
          const tareas = pendientesDeLectura.map((s) => 
            this.strapi.actualizarSolicitud(s.id, { leido: true })
          );
          forkJoin(tareas).subscribe({
            next: () => {
              this.solicitudesEnviadas.update((lista) =>
                lista.map((s) => (s.estado === 'respondida' ? { ...s, leido: true } : s))
              );
            }
          });
        }
      },
      error: (err) => {
        console.error('Error:', err);
        this.cargandoDatos.set(false);
      }
    });
  }

  setFiltro(nuevoFiltro: 'todas' | 'pendientes' | 'respondidas') {
    this.filtroActivo.set(nuevoFiltro);
  }
}