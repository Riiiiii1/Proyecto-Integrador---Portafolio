import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';

// AÑADIDO: Importamos 'createUserWithEmailAndPassword' desde las librerías de Firebase para permitir el registro manual
import { 
  Auth as FirebaseAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  authState,
  createUserWithEmailAndPassword 
} from '@angular/fire/auth';
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
    
    // Lista de correos autorizados para administrar el portafolio (Sin espacios vacíos)
    const emailsProgramadores = [
      'desbskull@gmail.com',
      'sisabuestandavidesteban@gmail.com',
      'antoniogordillo.1808@gmail.com'
    ];
    return emailsProgramadores.includes(user.email);
  });

  // Cierra la sesión activa en la aplicación
  logout() {
    signOut(this.firebaseAuth).then(() => {
      this.router.navigate(['/']);
    });
  }

  /**
   * Abre la ventana emergente oficial de Google para autenticar al usuario de forma rápida.
   */
  loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    return signInWithPopup(this.firebaseAuth, provider);
  }

  // =========================================================================
  // NUEVO MÉTODO AÑADIDO: Permite registrar usuarios usando correo y clave tradicional
  // =========================================================================
  /**
   * Registra una cuenta nueva directamente en la base de datos de seguridad de Firebase.
   * Una vez creada, Firebase inicia la sesión del usuario de forma automática en segundo plano.
   */
  registerWithEmail(email: string, password: string) {
    return createUserWithEmailAndPassword(this.firebaseAuth, email, password);
  }
}