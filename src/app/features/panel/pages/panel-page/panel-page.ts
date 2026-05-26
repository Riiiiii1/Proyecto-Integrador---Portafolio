import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Auth } from '../../../../core/services/auth/auth';
import { Firestore } from '../../../../core/services/firestore/firestore';
import { Solicitud } from '../../../../core/models/solicitud';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-panel-page',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './panel-page.html'
})
export class PanelPage implements OnInit {
  auth = inject(Auth);
  firestore = inject(Firestore);

  solicitudes = signal<Solicitud[]>([]);
  solicitudSeleccionada = signal<Solicitud | null>(null);
  filtroEstado = signal<'todas' | 'pendiente' | 'respondida'>('todas');
  respuesta = signal('');
  guardando = signal(false);
  cargando = signal(true);

  // Computados — se conectan a Firestore real cuando tu compañero lo configure
  solicitudesFiltradas() {
    if (this.filtroEstado() === 'todas') return this.solicitudes();
    return this.solicitudes().filter(s => s.estado === this.filtroEstado());
  }

  totalPendientes() {
    return this.solicitudes().filter(s => s.estado === 'pendiente').length;
  }

  totalRespondidas() {
    return this.solicitudes().filter(s => s.estado === 'respondida').length;
  }

  ngOnInit() {
    this.cargarSolicitudes();
  }

  async cargarSolicitudes() {
    this.cargando.set(true);
    // TODO: reemplazar slug con el del programador logueado desde Firebase
    const slug = 'david';
    const data = await this.firestore.getSolicitudesDeProgramador(slug);
    // Mock temporal para diseño
    this.solicitudes.set([
      {
        id: '1',
        uid: 'user1',
        correoUsuario: 'cliente1@email.com',
        nombreSolicitante: 'Juan Pérez',
        correoSolicitante: 'juan@email.com',
        idea: 'Necesito una app de gestión de inventario para mi negocio.',
        programadorSlug: slug,
        estado: 'pendiente',
        observacion: '',
        creadoEn: new Date()
      },
      {
        id: '2',
        uid: 'user2',
        correoUsuario: 'cliente2@email.com',
        nombreSolicitante: 'María García',
        correoSolicitante: 'maria@email.com',
        idea: 'Quiero un portafolio web para mostrar mi trabajo de diseño.',
        programadorSlug: slug,
        estado: 'respondida',
        observacion: 'Podemos agendar una reunión para discutir los detalles.',
        creadoEn: new Date()
      }
    ]);
    this.cargando.set(false);
  }

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
    // TODO: conectar con firestore.actualizarSolicitud() real
    await this.firestore.actualizarSolicitud(s.id, {
      estado: 'respondida',
      observacion: this.respuesta()
    });
    // Actualizar local
    this.solicitudes.update(lista =>
      lista.map(x => x.id === s.id
        ? { ...x, estado: 'respondida', observacion: this.respuesta() }
        : x
      )
    );
    this.guardando.set(false);
    this.cerrarDetalle();
  }

  setFiltro(f: 'todas' | 'pendiente' | 'respondida') {
    this.filtroEstado.set(f);
  }
}