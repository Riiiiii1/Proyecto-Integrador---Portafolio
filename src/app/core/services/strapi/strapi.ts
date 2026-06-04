import { Injectable, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Programador } from '../../models/programador';
import { Proyecto, Servicio } from '../../models/proyecto';
import { environment } from '../../../../environments/environment';

interface StrapiResponse<T> {
  data: T[];
}

interface StrapiProgramador {
  id: number;
  nombre: string;
  especialidad: string;
  descripcionBreve: string;
  descripcionCompleta: string;
  fotoPerfil: { url: string }[] | { url: string } | null;
  correo: string;
  github: string;
  linkedin: string;
  slug: string;
  activo: boolean;
  stack: string[];
}

interface StrapiProyecto {
  id: number;
  nombre: string;
  slug: string;
  descripcionBreve: string;
  descripcionCompleta: string;
  imagen: { url: string }[] | { url: string } | null;
  tipo: 'academico' | 'personal' | 'laboral' | 'simulado';
  tecnologias: string[];
  repositorio: string;
  demo: string;
  destacado: boolean;
  programadors: { id: number }[];
}

interface StrapiServicio {
  id: number;
  nombre: string;
  descripcion: string;
  icono: string;
}

@Injectable({ providedIn: 'root' })
export class StrapiService {
  private http = inject(HttpClient);
  private base = environment.strapiUrl;

  getProgramadores(): Observable<StrapiResponse<StrapiProgramador>> {
    return this.http
      .get<StrapiResponse<StrapiProgramador>>(`${this.base}/api/programadors?populate=*`)
      .pipe(
        tap(res => console.log('Programadores:', res)),
        catchError(() =>
          throwError(() => new Error('No se pudieron cargar los programadores'))
        )
      );
  }

  getProyectos(): Observable<StrapiResponse<StrapiProyecto>> {
    return this.http
      .get<StrapiResponse<StrapiProyecto>>(`${this.base}/api/proyectos?populate=*`)
      .pipe(
        tap(res => console.log('Proyectos:', res)),
        catchError(() =>
          throwError(() => new Error('No se pudieron cargar los proyectos'))
        )
      );
  }

  getServicios(): Observable<StrapiResponse<StrapiServicio>> {
    return this.http
      .get<StrapiResponse<StrapiServicio>>(`${this.base}/api/servicios?populate=*`)
      .pipe(
        tap(res => console.log('Servicios:', res)),
        catchError(() =>
          throwError(() => new Error('No se pudieron cargar los servicios'))
        )
      );
  }

  mapProgramador(item: StrapiProgramador): Programador {
    return {
      id:                  item.id,
      nombre:              item.nombre,
      especialidad:        item.especialidad,
      descripcionBreve:    item.descripcionBreve,
          descripcionCompleta: Array.isArray(item.descripcionCompleta)
      ? item.descripcionCompleta
          .map((block: any) => block.children?.map((c: any) => c.text).join('') ?? '')
          .join('\n')
      : item.descripcionCompleta ?? '',
          fotoPerfil: Array.isArray(item.fotoPerfil)
      ? (item.fotoPerfil[0]?.url ? `${this.base}${item.fotoPerfil[0].url}` : '')
      : (item.fotoPerfil?.url ? `${this.base}${item.fotoPerfil.url}` : ''),
      correo:              item.correo,
      github:              item.github,
      linkedin:            item.linkedin,
      slug:                item.slug,
      activo:              item.activo,
      stack:               item.stack ?? [],
    };
  }

  mapProyecto(item: StrapiProyecto): Proyecto {
    return {
      id:                  item.id,
      nombre:              item.nombre,
      slug:                item.slug,
      descripcionBreve:    item.descripcionBreve,
      descripcionCompleta: item.descripcionCompleta,
          imagen: Array.isArray(item.imagen)
      ? (item.imagen[0]?.url ? `${this.base}${item.imagen[0].url}` : '')
      : (item.imagen?.url ? `${this.base}${item.imagen.url}` : ''),
      tipo:                item.tipo,
      tecnologias:         item.tecnologias ?? [],
      repositorio:         item.repositorio ?? '',
      demo:                item.demo ?? '',
      destacado:           item.destacado ?? false,
      programadores:       item.programadors?.map(p => p.id) ?? [],
    };
  }
  mapServicio(item: StrapiServicio): Servicio {
  return {
    id:          item.id,
    nombre:      item.nombre,
    descripcion: item.descripcion,
    icono:       item.icono,
  };
}
}