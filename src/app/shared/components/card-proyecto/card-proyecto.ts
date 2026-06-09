
import { Component, effect, inject, input, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Proyecto } from '../../../core/models/proyecto';
import { Programador } from '../../../core/models/programador';

@Component({
  selector: 'app-card-proyecto',
  imports: [],
  templateUrl: './card-proyecto.html',
  styles: ``,
})
export class CardProyecto {
  proyecto = input.required<Proyecto>(); 
  programadores = input.required<Programador[]>(); 

  private http = inject(HttpClient);
  private sanitizer = inject(DomSanitizer);
  imagenProyectoSegura = signal<SafeUrl | null>(null);
  imagenesDevsSeguras = signal<Record<number, SafeUrl>>({});

  constructor() {
    effect(() => {
      const proy = this.proyecto();
      const devs = this.programadores();

     
      if (proy?.imagen) {
        this.descargarImagenSegura(proy.imagen, (urlSegura) => {
          this.imagenProyectoSegura.set(urlSegura);
        });
      }

     
      if (proy?.programadores && devs.length > 0) {
        proy.programadores.forEach((id: number) => {
          const dev = devs.find(d => d.id === id);
          if (dev?.fotoPerfil) {
            this.descargarImagenSegura(dev.fotoPerfil, (urlSegura) => {
             
              this.imagenesDevsSeguras.update(prev => ({ ...prev, [id]: urlSegura }));
            });
          }
        });
      }
    });  }
  getProgramadores() {
    return this.programadores();
  }
  private descargarImagenSegura(url: string, callback: (segura: SafeUrl) => void) {
    const headers = new HttpHeaders({ 'ngrok-skip-browser-warning': 'true' });
    
    this.http.get(url, { headers, responseType: 'blob' }).subscribe({
      next: (blob) => {
        const objectUrl = URL.createObjectURL(blob);
        callback(this.sanitizer.bypassSecurityTrustUrl(objectUrl));
      },
      error: (err) => console.error('Error cargando imagen en card-proyecto:', err)
    });
  }
}