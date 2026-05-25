import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core'; // <-- Añadir signal
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  
  private fb = inject(FormBuilder);
  private router = inject(Router);

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
    console.log('Datos de inicio de sesión:', this.form.value);
    this.router.navigate(['/']);
  }
}