import { Component, inject, signal, effect, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../../core/services/auth/auth';
import { StrapiService } from '../../../core/services/strapi/strapi';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnDestroy {
  auth = inject(Auth);
  strapi = inject(StrapiService);

  // Contador para el perfil Cliente
  mensajesNuevosCliente = signal<number>(0);
  
  // Contador para el perfil Programador (Nuevas propuestas sin revisar)
  mensajesNuevosProgramador = signal<number>(0);

  // Guardamos la referencia del temporizador para poder limpiarlo
  private intervaloId: any;

  constructor() {
    effect(() => {
      const user = this.auth.currentUser();
      const esProgramador = this.auth.isProgramador();

      // Limpiamos cualquier temporizador previo si cambia el estado de la sesión
      this.limpiarIntervalo();

      if (user && user.email) {
        if (esProgramador) {
          // Si es programador, extraemos su slug (puedes usar el alias o correo según tu Auth)
          // Asumimos que mapeas el slug del programador. Si usas el correo directo, adaptamos la consulta.
          const programadorSlug = user.email === 'antoniogordillo.1808@gmail.com' ? 'carlos-gordillo' : 'david-sisa';
          
          this.revisarNotificacionesProgramador(programadorSlug);
          
          // Escucha activa cada 3 segundos para el desarrollador
          this.intervaloId = setInterval(() => {
            this.revisarNotificacionesProgramador(programadorSlug);
          }, 3000);

        } else {
          // Si es un cliente regular (caunidrive)
          this.revisarNotificacionesCliente(user.email);
          
          // Escucha activa cada 3 segundos para el cliente
          this.intervaloId = setInterval(() => {
            this.revisarNotificacionesCliente(user.email!);
          }, 3000);
        }
      } else {
        // Si nadie está logueado, reseteamos ambos contadores
        this.mensajesNuevosCliente.set(0);
        this.mensajesNuevosProgramador.set(0);
      }
    });
  }

  revisarNotificacionesCliente(email: string) {
    this.strapi.getSolicitudesDeCliente(email).subscribe({
      next: (solicitudes) => {
        const noLeidas = solicitudes.filter(s => s.estado === 'respondida' && s.leido === false).length;
        this.mensajesNuevosCliente.set(noLeidas);
      },
      error: (err) => console.error('Error notificaciones cliente en Navbar:', err)
    });
  }

  revisarNotificacionesProgramador(slug: string) {
    this.strapi.getSolicitudesDeProgramador(slug).subscribe({
      next: (solicitudes) => {
        // Filtramos las solicitudes que NO han sido contestadas aún (estado vacío, nulo o diferente de respondida)
        const sinRevisar = solicitudes.filter(s => !s.estado || s.estado !== 'respondida').length;
        this.mensajesNuevosProgramador.set(sinRevisar);
      },
      error: (err) => console.error('Error notificaciones programador en Navbar:', err)
    });
  }

  ngOnDestroy() {
    this.limpiarIntervalo();
  }

  private limpiarIntervalo() {
    if (this.intervaloId) {
      clearInterval(this.intervaloId);
      this.intervaloId = null;
    }
  }
}