import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core'; // <-- Añadir signal
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { passwordMatchValidator } from '../../validators/password-match.validator';
import { emailUniqueValidator } from '../../validators/email-unique.validator';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPage {
  
  private fb = inject(FormBuilder);
  private router = inject(Router);

  // Variables de estado para los botones del ojito
  showPassword = signal(false);
  showConfirmPassword = signal(false);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email], [emailUniqueValidator()]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
  }, { validators: passwordMatchValidator });

  get email() { return this.form.get('email')!; }
  get password() { return this.form.get('password')!; }
  get confirmPassword() { return this.form.get('confirmPassword')!; }

  // Funciones para alternar la vista
  togglePassword() {
    this.showPassword.set(!this.showPassword());
  }

  toggleConfirmPassword() {
    this.showConfirmPassword.set(!this.showConfirmPassword());
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log('Datos del formulario:', this.form.value);
    this.router.navigate(['/']);
  }
}