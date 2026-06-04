import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { StrapiService } from '../../../../core/services/strapi/strapi';
import { Firestore } from '../../../../core/services/firestore/firestore';
import { Auth } from '../../../../core/services/auth/auth';

@Component({
  selector: 'app-nueva-solicitud-page',
  imports: [ReactiveFormsModule],
  templateUrl: './nueva-solicitud-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NuevaSolicitudPage {
  private fb           = inject(FormBuilder);
  private router       = inject(Router);
  private route        = inject(ActivatedRoute);
  private strapiService = inject(StrapiService);
  private firestore    = inject(Firestore);
  private auth         = inject(Auth);

  enviando = signal(false);
  error    = signal('');

  programadoresResource = rxResource({
    stream: () => this.strapiService.getProgramadores().pipe(
      map(res => res.data.map(p => this.strapiService.mapProgramador(p)))
    ),
  });

  form = this.fb.group({
    nombreSolicitante: ['', [Validators.required]],
    correoSolicitante: ['', [Validators.required, Validators.email]],
    programadorSlug:   ['', [Validators.required]],
    idea:              ['', [Validators.required, Validators.minLength(10)]],
  });

  constructor() {
    this.route.queryParams.subscribe(params => {
      if (params['dev']) {
        this.form.patchValue({ programadorSlug: params['dev'] });
      }
    });
  }

  get nombreSolicitante() { return this.form.get('nombreSolicitante')!; }
  get correoSolicitante() { return this.form.get('correoSolicitante')!; }
  get programadorSlug()   { return this.form.get('programadorSlug')!; }
  get idea()              { return this.form.get('idea')!; }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const user = this.auth.currentUser();
    if (!user) {
      this.error.set('Debes iniciar sesión para enviar una solicitud.');
      return;
    }

    this.enviando.set(true);
    this.error.set('');

    try {
      await this.firestore.crearSolicitud({
        uid:               user.uid,
        correoUsuario:     user.email ?? '',
        nombreSolicitante: this.form.value.nombreSolicitante!,
        correoSolicitante: this.form.value.correoSolicitante!,
        programadorSlug:   this.form.value.programadorSlug!,
        idea:              this.form.value.idea!,
        estado:            'pendiente',
        observacion:       '',
        creadoEn:          new Date(),
      });

      this.router.navigate(['/solicitudes/mis']);
    } catch (e) {
      this.error.set('Error al enviar la solicitud. Intenta de nuevo.');
    } finally {
      this.enviando.set(false);
    }
  }
}