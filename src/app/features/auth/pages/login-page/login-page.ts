import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core'; // <-- Añadir signal
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

// Importamos tu clase original Auth para interactuar con Firebase
import { Auth } from '../../../../core/services/auth/auth';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(Auth); // Inyectamos tu clase de autenticación

  // Variable de estado para mostrar/ocultar contraseña
  showPassword = signal(false);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  get email() { return this.form.get('email')!; }
  get password() { return this.form.get('password')!; }

  // Función para alternar la vista
  togglePassword() {
    this.showPassword.set(!this.showPassword());
  }
onSubmit() {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  const { email, password } = this.form.value;

  this.auth.loginWithEmail(email!, password!)
    .then(() => {
      if (this.auth.isProgramador()) {
        this.router.navigate(['/panel']);
      } else {
        this.router.navigate(['/']);
      }
    })
    .catch((error) => {
      console.error('Error al iniciar sesión:', error.code);
    });
}

  /**
   * Dispara el flujo de inicio de sesión con Google.
   * Si es exitoso, redirige temporalmente al Home o al Panel según corresponda.
   */
  ingresarConGoogle() {
    this.auth.loginWithGoogle()
      .then((resultado) => {
        console.log('Usuario conectado vía Google:', resultado.user.displayName);
        // Redirigimos al inicio una vez autenticado correctamente
        this.router.navigate(['/']);
      })
      .catch((error) => {
        console.error('Error durante la autenticación con Google:', error);
      });
  }
}