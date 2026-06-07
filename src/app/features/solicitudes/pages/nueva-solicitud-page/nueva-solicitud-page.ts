import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StrapiService } from '../../../../core/services/strapi/strapi';
import { Auth } from '../../../../core/services/auth/auth';

@Component({
  selector: 'app-nueva-solicitud-page',
  imports: [ReactiveFormsModule],
  templateUrl: './nueva-solicitud-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NuevaSolicitudPage implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  protected strapi = inject(StrapiService);
  public auth = inject(Auth);

  // Señales visuales
  enviando = signal(false);
  mensajeExito = signal(false);

  form = this.fb.group({
    nombreSolicitante: ['', [Validators.required]],
    correoSolicitante: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
    programadorSlug: ['', [Validators.required]],
    idea: ['', [Validators.required, Validators.minLength(10)]],
  });

  ngOnInit() {
    this.strapi.cargarTodo();
    
    const userEmail = this.auth.currentUser()?.email;
    if (userEmail) {
      this.form.patchValue({ correoSolicitante: userEmail });
    }
    
    this.route.queryParams.subscribe(params => {
      if (params['dev']) {
        this.form.patchValue({ programadorSlug: params['dev'] });
      }
    });
  }

  get nombreSolicitante() { return this.form.get('nombreSolicitante')!; }
  get correoSolicitante() { return this.form.get('correoSolicitante')!; }
  get programadorSlug() { return this.form.get('programadorSlug')!; }
  get idea() { return this.form.get('idea')!; }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Activamos la animación de "Enviando..."
    this.enviando.set(true);

    const nuevaSolicitud = this.form.getRawValue();

    this.strapi.crearSolicitud(nuevaSolicitud).subscribe({
      next: () => {
        // Apagamos el envío y mostramos el cuadro de éxito
        this.enviando.set(false);
        this.mensajeExito.set(true);
        
        // Esperamos 3 segundos exactos para que el cliente lea el mensaje
        setTimeout(() => {
          this.router.navigate(['/solicitudes/mis']);
        }, 5000);
      },
      error: (err) => {
        console.error('Error al registrar en Strapi:', err);
        this.enviando.set(false);
        alert('Hubo un error al enviar la solicitud. Revisa la consola.');
      }
    });
  }
}