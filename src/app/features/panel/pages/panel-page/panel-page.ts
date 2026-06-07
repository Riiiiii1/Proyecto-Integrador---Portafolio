import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Auth } from '../../../../core/services/auth/auth'; 
import { StrapiService } from '../../../../core/services/strapi/strapi'; 
import { Solicitud } from '../../../../core/models/solicitud';
import { DatePipe } from '@angular/common'; 

@Component({
  selector: 'app-panel-page',
  standalone: true,
  imports: [RouterLink, DatePipe], 
  templateUrl: './panel-page.html'
})
export class PanelPage implements OnInit, OnDestroy {
  auth = inject(Auth); 
  private strapi = inject(StrapiService); 

  solicitudes = signal<any[]>([]);
  solicitudSeleccionada = signal<any | null>(null);
  filtroEstado = signal<'todas' | 'pendiente' | 'respondida'>('todas');
  respuesta = signal('');
  guardando = signal(false);
  cargando = signal(true);

  // Referencia para limpiar el temporizador al salir del componente
  private intervaloId: any;

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
    // 1. Carga inicial con animación de carga
    this.cargarSolicitudes(true);

    // 2. Escucha activa cada 3 segundos (silenciosa, sin animación de carga ruda)
    this.intervaloId = setInterval(() => {
      // Solo refresca si el programador NO está escribiendo una respuesta en una modal abierta
      if (!this.solicitudSeleccionada() && !this.guardando()) {
        this.cargarSolicitudes(false);
      }
    }, 3000);
  }

  // Añadimos el parámetro opcional 'mostrarLoading' para controlar los parpadeos de pantalla
  cargarSolicitudes(mostrarLoading: boolean = false) {
    if (mostrarLoading) {
      this.cargando.set(true);
    }

    // Identificar quién inició sesión mediante su correo de Google
    const emailLogueado = this.auth.currentUser()?.email;
    let miSlug = 'carlos-gordillo'; 

    if (emailLogueado === 'desbskull@gmail.com' || emailLogueado === 'sisabuestandavidesteban@gmail.com') {
      miSlug = 'david-sisa';
    }

    // Traer las solicitudes verdaderas desde la base de datos de Strapi
    this.strapi.getSolicitudesDeProgramador(miSlug).subscribe({
      next: (datos) => {
        // Mapeamos los datos asegurando que tengan un estado por defecto si están vacíos en Strapi
        const limpias = (datos || []).map(s => ({
          ...s,
          estado: s.estado ? s.estado : 'pendiente' 
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

  cerrarDetail() {
    this.cerrarDetalle();
  }

  cerrarDetalle() {
    this.solicitudSeleccionada.set(null);
    this.respuesta.set('');
  }

  guardarRespuesta() {
    const s = this.solicitudSeleccionada();
    if (!s?.id) return; 
    
    this.guardando.set(true);

    const datosActualizados = {
      estado: 'respondida',
      observacion: this.respuesta()
    };

    this.strapi.actualizarSolicitud(s.id, datosActualizados).subscribe({
      next: () => {
        this.solicitudes.update(lista =>
          lista.map(x => x.id === s.id
            ? { ...x, estado: 'respondida', observacion: this.respuesta() }
            : x
          )
        ); 
        this.guardando.set(false); 
        this.cerrarDetalle();
        
        // Forzamos un refresco inmediato tras guardar para asegurar simetría de datos
        this.cargarSolicitudes(false);
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

  // Destruimos el temporizador al salir de la página para que la app no trabaje de más
  ngOnDestroy() {
    if (this.intervaloId) {
      clearInterval(this.intervaloId);
    }
  }
}