import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { signInWithEmailAndPassword } from '@angular/fire/auth';
// Importamos los módulos de Firebase usando un alias para evitar colisiones de nombres [cite: 11]
import { Auth as FirebaseAuth, GoogleAuthProvider, signInWithPopup, signOut, authState } from '@angular/fire/auth';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class Auth {
    private router = inject(Router);
    private firebaseAuth = inject(FirebaseAuth); // Inyectamos el servicio de Firebase [cite: 11]

  // Estado reactivo para el usuario actual (Conectado directamente a Firebase a través de toSignal) [cite: 7, 11]
currentUser = toSignal(authState(this.firebaseAuth), { initialValue: null });

  // Estados computados para verificar si el usuario está logueado y si es programador [cite: 8, 11]
 isLoggedIn = computed(() => this.currentUser() !== null);
  
isProgramador = computed(() => {
  const user = this.currentUser();

  // 1. PRIMERO declaras la lista de correos permitidos
  const emailsProgramadores = [
    'sisabuestandavidesteban@gmail.com',
    'carlos@gmail.com',
    'david.duodev@gmail.com',   
    'antoniogordillo.1808@gmail.com'
  ];

  // 2. AHORA SÍ puedes usar la lista en tus impresiones de consola
  console.log('Usuario actual:', user?.email);
  console.log('¿Es programador?:', user?.email && emailsProgramadores.includes(user.email));

  // 3. Tu validación final
  if (!user || !user.email) return false;
  return emailsProgramadores.includes(user.email);
});

  // Si el usuario no es programador, se le redirige al home [cite: 10, 11]
  logout() {
    // Cerramos la sesión directamente en los servidores de Firebase [cite: 11]
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
    
    // =========================================================================
    // LÍNEA CLAVE AÑADIDA: Forza a Google a pedir la selección de cuenta siempre
    // =========================================================================
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    return signInWithPopup(this.firebaseAuth, provider);
  }
  loginWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(this.firebaseAuth, email, password);
}
}