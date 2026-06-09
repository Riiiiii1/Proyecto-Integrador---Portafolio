
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
  // Este input required es para recibir el programador desde el homepage.
  // Este es para asegurar que el componente siempre reciba al menos un programador.
  // Es de tipo Programador del Interfaz.
  programador = input.required<Programador>();
  // Inyectamos las herramientas directamente aquí
  private http = inject(HttpClient);
  private sanitizer = inject(DomSanitizer);

  // Esta variable guardará la imagen lista para mostrarse
  fotoSegura = signal<SafeUrl | null>(null);

  constructor() {
    // Este effect se ejecuta automáticamente apenas llegue la data del programador
    effect(() => {
      const url = this.programador()?.fotoPerfil;
      
      if (url) {
        // Preparamos el pase VIP
        const headers = new HttpHeaders({ 'ngrok-skip-browser-warning': 'true' });
        
        // Descargamos la imagen como archivo binario (blob)
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
