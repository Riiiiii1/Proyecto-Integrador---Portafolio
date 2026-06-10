import { Programador } from '../../../core/models/programador';
import { Component, effect, inject, input, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-card-programador',
  imports: [RouterLink],
  templateUrl: './card-programador.html',
  styles: ``,
})
export class CardProgramador {
  programador = input.required<Programador>();

  private http = inject(HttpClient);
  private sanitizer = inject(DomSanitizer);

  fotoSegura = signal<SafeUrl | null>(null);

  constructor() {
    effect(() => {
      const url = this.programador()?.fotoPerfil;
      
      if (url) {
        const headers = new HttpHeaders({ 'ngrok-skip-browser-warning': 'true' });
        this.http.get(url, { headers, responseType: 'blob' }).subscribe({
          next: (blob) => {
            const objectUrl = URL.createObjectURL(blob);
            this.fotoSegura.set(this.sanitizer.bypassSecurityTrustUrl(objectUrl));
          },
          error: (err) => {
            console.error('Error cargando imagen:', err);
            this.fotoSegura.set(null);
          }
        });
      }
    });
  }
}