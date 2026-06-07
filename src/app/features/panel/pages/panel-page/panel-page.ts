import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Auth } from '../../../../core/services/auth/auth'; // 
import { StrapiService } from '../../../../core/services/strapi/strapi'; // Cambiado de Firestore a Strapi
import { Solicitud } from '../../../../core/models/solicitud';
import { DatePipe } from '@angular/common'; // 

@Component({
  selector: 'app-panel-page',
  standalone: true,
  imports: [RouterLink, DatePipe], // 
  templateUrl: './panel-page.html'
})
export class PanelPage implements OnInit {
  auth = inject(Auth); // 
  private strapi = inject(StrapiService); // Inyectamos nuestro puente real a Strapi

  solicitudes = signal<any[]>([]);
  solicitudSeleccionada = signal<any | null>(null);
  filtroEstado = signal<'todas' | 'pendiente' | 'respondida'>('todas');
  respuesta = signal('');
  guardando = signal(false);
  cargando = signal(true);

  // Filtra los datos en pantalla de forma reactiva
  solicitudesFiltradas() {
    if (this.filtroEstado() === 'todas') return this.solicitudes(); 
    return this.solicitudes().filter(s => s.estado === this.filtroEstado()); 
  }

  totalPendientes() {
    return this.solicitudes().filter(s => s.estado === 'pendiente' || !s.estado).length;
  }

  totalRespondidas() {
    return this.solicitudes().filter(s => s.estado === 'respondida').length;
  }

  ngOnInit() {
    this.cargarSolicitudes();
  }

  cargarSolicitudes() {
    this.cargando.set(true);

    // 1. Identificar quién inició sesión mediante su correo de Google
    const emailLogueado = this.auth.currentUser()?.email;
    let miSlug = 'carlos-gordillo'; // Por defecto Carlos

    if (emailLogueado === 'desbskull@gmail.com' || emailLogueado === 'sisabuestandavidesteban@gmail.com') {
      miSlug = 'david-sisa';
    }

    // 2. Traer las solicitudes verdaderas desde la base de datos de Strapi
    this.strapi.getSolicitudesDeProgramador(miSlug).subscribe({
      next: (datos) => {
        // Mapeamos los datos asegurando que tengan un estado por defecto si están vacíos en Strapi
        const limpias = (datos || []).map(s => ({
          ...s,
          estado: s.estado ? s.estado : 'pendiente' // Si no tiene estado, es nueva (pendiente)
        }));
        this.solicitudes.set(limpias);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al cargar el panel de Strapi:', err);
        this.cargando.set(false);
      }
    });
  }

  seleccionar(solicitud: any) {
    this.solicitudSeleccionada.set(solicitud);
    this.respuesta.set(solicitud.observacion || ''); 
  }

  cerrarDetalle() {
    this.solicitudSeleccionada.set(null);
    this.respuesta.set('');
  }

  guardarRespuesta() {
    const s = this.solicitudSeleccionada();
    if (!s?.id) return; 
    
    this.guardando.set(true);

    // Creamos el paquete exacto con los datos que se van a modificar en el servidor
    const datosActualizados = {
      estado: 'respondida',
      observacion: this.respuesta()
    };

    // LLAMADA CORREGIDA: Usamos 'actualizarSolicitud' enviando el ID único y el paquete de datos
    this.strapi.actualizarSolicitud(s.id, datosActualizados).subscribe({
      next: () => {
        // Actualizamos de forma inmediata la tarjeta en la pantalla del usuario sin recargar toda la página
        this.solicitudes.update(lista =>
          lista.map(x => x.id === s.id
            ? { ...x, estado: 'respondida', observacion: this.respuesta() }
            : x
          )
        ); 
        this.guardando.set(false); 
        this.cerrarDetalle();
      },
      error: (err) => {
        console.error('Error al actualizar el estado en Strapi:', err);
        this.guardando.set(false);
        alert('No se pudo guardar la respuesta en el servidor. Verifique la conexión.');
      }
    });
  }

  setFiltro(f: 'todas' | 'pendiente' | 'respondida') {
    this.filtroEstado.set(f); 
  }
}