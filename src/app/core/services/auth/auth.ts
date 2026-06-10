import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { signInWithEmailAndPassword } from '@angular/fire/auth';
import { Auth as FirebaseAuth, GoogleAuthProvider, signInWithPopup, signOut, authState, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { toSignal } from '@angular/core/rxjs-interop';
@Injectable({
  providedIn: 'root',
})
export class Auth {
    private router = inject(Router);
    
    private firebaseAuth = inject(FirebaseAuth); 
    
    currentUser = toSignal(authState(this.firebaseAuth), { initialValue: null });

    isLoggedIn = computed(() => this.currentUser() !== null);

    isProgramador = computed(() => {
      const user = this.currentUser();
      const emailsProgramadores = [
        'sisabuestandavidesteban@gmail.com',
        'antoniogordillo.1808@gmail.com',
        'caunidrive@gmail.com'
      ];
      console.log('Usuario actual:', user?.email);
      console.log('¿Es programador?:', user?.email && emailsProgramadores.includes(user.email));
      if (!user || !user.email) return false;
      return emailsProgramadores.includes(user.email);
    });

    logout() {
      signOut(this.firebaseAuth).then(() => {
        this.router.navigate(['/']);
      });
    }

    loginWithGoogle() {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      return signInWithPopup(this.firebaseAuth, provider);
    }

    loginWithEmail(email: string, password: string) {
      return signInWithEmailAndPassword(this.firebaseAuth, email, password);
    }
    registerWithEmail(email: string, password: string) {
    return createUserWithEmailAndPassword(this.firebaseAuth, email, password);
  }
}


