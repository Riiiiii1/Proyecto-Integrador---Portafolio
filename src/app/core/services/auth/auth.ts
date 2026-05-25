import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Auth {
    private router = inject(Router);

  // Estado reactivo para el usuario actual
  currentUser = signal<any>(null);

  // Estados computados para verificar si el usuario está logueado y si es programador 
  isLoggedIn = computed(() => this.currentUser() !== null);
  isProgramador = computed(() => {
    const user = this.currentUser();
    if (!user) return false;
    // Verificar si el email del usuario está en la lista de programadores autorizados
    const emailsProgramadores = ['david@email.com', 'carlos@email.com'];
    return emailsProgramadores.includes(user.email);
  });
  // Si el usuario no es programador, se le redirige al home
  logout() {
    this.currentUser.set(null);
    this.router.navigate(['/']);
  }
}
