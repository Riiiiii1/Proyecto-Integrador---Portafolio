import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; 
import { passwordMatchValidator } from '../../validators/password-match.validator'; 
import { emailUniqueValidator } from '../../validators/email-unique.validator'; 
import { Auth } from '../../../../core/services/auth/auth'; // <-- Asegúrate de enlazar la ruta correcta de tu servicio auth

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, RouterLink], 
  templateUrl: './register-page.html', 
  changeDetection: ChangeDetectionStrategy.OnPush, 
})
export class RegisterPage {
  
  private fb = inject(FormBuilder);
  private router = inject(Router); 
  private authService = inject(Auth); // <-- Inyectamos tu motor de autenticación

  // Variables de estado reactivas
  showPassword = signal(false); 
  showConfirmPassword = signal(false); 
  cargando = signal(false); // <-- Añadido para controlar el texto del botón al procesar

  form = this.fb.group({ 
    email: ['', [Validators.required, Validators.email], [emailUniqueValidator()]], 
    password: ['', [Validators.required, Validators.minLength(8)]], 
    confirmPassword: ['', [Validators.required]], 
  }, { validators: passwordMatchValidator }); 

  get email() { return this.form.get('email')!; } 
  get password() { return this.form.get('password')!; }
  get confirmPassword() { return this.form.get('confirmPassword')!; } 

  togglePassword() {
    this.showPassword.set(!this.showPassword()); 
  }

  toggleConfirmPassword() {
    this.showConfirmPassword.set(!this.showConfirmPassword()); 
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); 
      return; 
    }

    this.cargando.set(true);
    // getRawValue obtiene los datos de forma limpia y tipada
    const { email, password } = this.form.getRawValue();

    try {
      // 1. Llamada asíncrona a Firebase para crear y registrar la cuenta tradicional
      await this.authService.registerWithEmail(email!, password!); 
      
      this.cargando.set(false);

      // 2. Redirección inmediata al Home. Al cambiar la ruta, el Navbar se actualizará 
      // automáticamente identificando al nuevo usuario logueado.
      this.router.navigate(['/']); 

    } catch (error) {
      console.error('Error durante el proceso de registro manual:', error);
      this.cargando.set(false);
      alert('Hubo un inconveniente al intentar guardar sus datos. Por favor compruebe la información e intente de nuevo.');
    }
  }
}