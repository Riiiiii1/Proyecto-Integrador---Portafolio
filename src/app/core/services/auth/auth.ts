import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';

// Importamos los módulos de Firebase usando un alias para evitar colisiones de nombres
import { Auth as FirebaseAuth, GoogleAuthProvider, signInWithPopup, signOut, authState } from '@angular/fire/auth';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class Auth {
    private router = inject(Router);
    private firebaseAuth = inject(FirebaseAuth); // Inyectamos el servicio de Firebase

  // Estado reactivo para el usuario actual (Conectado directamente a Firebase a través de toSignal)
  currentUser = toSignal(authState(this.firebaseAuth));

  // Estados computados para verificar si el usuario está logueado y si es programador 
  isLoggedIn = computed(() => this.currentUser() !== null && this.currentUser() !== undefined);
  
  isProgramador = computed(() => {
    const user = this.currentUser();
    if (!user || !user.email) return false;
    // Verificar si el email del usuario está en la lista de programadores autorizados
    // (Añadimos tu cuenta de Gmail de soporte para las pruebas de acceso al Panel)
    const emailsProgramadores = ['david@email.com', 'carlos@email.com', 'antoniogordillo.1808@gmail.com'];
    return emailsProgramadores.includes(user.email);
  });

  // Si el usuario no es programador, se le redirige al home
  logout() {
    // Cerramos la sesión directamente en los servidores de Firebase
    signOut(this.firebaseAuth).then(() => {
      this.router.navigate(['/']);
    });
  }

  /**
   * Abre la ventana emergente oficial de Google para autenticar al usuario.
   * Retorna una promesa con las credenciales obtenidas.
   */
  loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.firebaseAuth, provider);
  }
}