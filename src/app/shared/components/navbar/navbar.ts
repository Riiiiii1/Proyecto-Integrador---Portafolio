import { Component, inject, signal, effect, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../../core/services/auth/auth';
import { Firestore } from '../../../core/services/firestore/firestore'; // <-- Ahora usamos Firebase

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnDestroy {
  auth = inject(Auth);
  firestore = inject(Firestore);

  // Menú para celulares
  isMobileMenuOpen = signal(false);

  // Contadores de notificaciones
  mensajesNuevosCliente = signal<number>(0);
  mensajesNuevosProgramador = signal<number>(0);
  
  private intervaloId: any;

  constructor() {
    effect(() => {
      const user = this.auth.currentUser();
      const esProgramador = this.auth.isProgramador();

      this.limpiarIntervalo();

      if (user) {
        if (esProgramador) {
          // Asignamos el slug basado en el correo para buscar en Firebase
          const programadorSlug = user.email?.includes('antoniogordillo') ? 'carlos-gordillo' : 'david-sisa';
          
          this.revisarNotificacionesProgramador(programadorSlug);
          this.intervaloId = setInterval(() => this.revisarNotificacionesProgramador(programadorSlug), 3000);
        } else {
          this.revisarNotificacionesCliente(user.uid); // Firebase usa UID
          this.intervaloId = setInterval(() => this.revisarNotificacionesCliente(user.uid), 3000);
        }
      } else {
        this.mensajesNuevosCliente.set(0);
        this.mensajesNuevosProgramador.set(0);
      }
    });
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.set(!this.isMobileMenuOpen());
  }

  revisarNotificacionesCliente(uid: string) {
    this.firestore.getSolicitudesDeUsuario(uid).then(solicitudes => {
      // Cuenta las que el programador ya respondió pero el cliente no ha leído
      const noLeidas = solicitudes.filter(s => s.estado === 'respondida' && s.leido === false).length;
      this.mensajesNuevosCliente.set(noLeidas);
    }).catch(err => console.error('Error Firebase Navbar Cliente:', err));
  }

  revisarNotificacionesProgramador(slug: string) {
    this.firestore.getSolicitudesDeProgramador(slug).then(solicitudes => {
      // Cuenta las propuestas nuevas
      const sinRevisar = solicitudes.filter(s => !s.estado || s.estado === 'pendiente').length;
      this.mensajesNuevosProgramador.set(sinRevisar);
    }).catch(err => console.error('Error Firebase Navbar Programador:', err));
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