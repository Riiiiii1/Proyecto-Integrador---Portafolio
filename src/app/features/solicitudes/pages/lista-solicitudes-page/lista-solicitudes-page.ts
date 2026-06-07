import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StrapiService } from '../../../../core/services/strapi/strapi';
import { Auth } from '../../../../core/services/auth/auth';

@Component({
  selector: 'app-lista-solicitudes-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-solicitudes-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaSolicitudesPage implements OnInit {
  private strapi = inject(StrapiService);
  private auth = inject(Auth);

  // Almacena las solicitudes encontradas en la base de datos
  solicitudesEnviadas = signal<any[]>([]);
  
  // Controla si el sistema todavía está buscando la información
  cargandoDatos = signal(true);

  ngOnInit() {
    // Extraemos el correo del usuario actual de Google
    const correoUsuario = this.auth.currentUser()?.email;

    if (correoUsuario) {
      // Llamamos al servicio para traer solo sus solicitudes desde Strapi
      this.strapi.getSolicitudesDeCliente(correoUsuario).subscribe({
        next: (datos) => {
          this.solicitudesEnviadas.set(datos || []);
          this.cargandoDatos.set(false);
        },
        error: (err) => {
          console.error('Error al recuperar las solicitudes:', err);
          this.cargandoDatos.set(false);
        }
      });
    } else {
      this.cargandoDatos.set(false);
    }
  }
}