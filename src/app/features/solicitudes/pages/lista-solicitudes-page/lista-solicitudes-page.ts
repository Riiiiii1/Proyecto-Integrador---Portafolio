import { ChangeDetectionStrategy, Component, inject, resource } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { from } from 'rxjs';
import { Auth } from '../../../../core/services/auth/auth';
import { Firestore } from '../../../../core/services/firestore/firestore';

@Component({
  selector: 'app-lista-solicitudes-page',
  imports: [DatePipe, RouterLink],
  templateUrl: './lista-solicitudes-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaSolicitudesPage {
  private firestore = inject(Firestore);
  readonly auth = inject(Auth);

solicitudesResource = resource({
  params: () => this.auth.currentUser()?.uid,
  loader: ({ params: uid }) => uid
    ? this.firestore.getSolicitudesDeUsuario(uid)
    : Promise.resolve([])
});

  formatSlug(slug: string): string {
    return slug
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }
}