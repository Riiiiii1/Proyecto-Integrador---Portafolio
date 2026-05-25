import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StrapiService } from '../../../../core/services/strapi/strapi';

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

  form = this.fb.group({
    nombreSolicitante: ['', [Validators.required]],
    correoSolicitante: ['', [Validators.required, Validators.email]],
    programadorSlug: ['', [Validators.required]],
    idea: ['', [Validators.required, Validators.minLength(10)]],
  });

  ngOnInit() {
    this.strapi.cargarTodo();
    
    // Si un cliente entra desde el perfil de un programador específico, precargamos el campo
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

    console.log('Nueva Solicitud para registrar en Firebase:', this.form.value);
    // Nota: Aquí se integrará la llamada al servicio de base de datos posteriormente
    
    this.router.navigate(['/']);
  }
}