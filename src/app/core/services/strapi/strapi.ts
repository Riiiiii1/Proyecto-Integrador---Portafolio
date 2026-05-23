import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Programador } from '../../models/programador';
import { Proyecto, Servicio } from '../../models/proyecto';
import { environment } from '../../../../environments/environment';


// hecho por el GEMINI (ESTOS DATOS DEBES CONSUMIR DESDE STRAPI CARLOS)
const MOCK_PROGRAMADORES: Programador[] = [
  {
    id: 1, slug: 'tu-nombre',
    nombre: 'Tu Nombre', especialidad: 'Frontend Developer',
    descripcionBreve: 'Apasionado del frontend y la experiencia de usuario.',
    descripcionCompleta: 'Descripción larga aquí...',
    fotoPerfil: 'https://i.pravatar.cc/300?img=1',
    correo: 'tu@email.com', github: 'https://github.com/tuuser',
    linkedin: 'https://linkedin.com/in/tuuser', activo: true
  },
  {
    id: 2, slug: 'compañero-nombre',
    nombre: 'Nombre Compañero', especialidad: 'Backend Developer',
    descripcionBreve: 'Especialista en APIs y bases de datos.',
    descripcionCompleta: 'Descripción larga aquí...',
    fotoPerfil: 'https://i.pravatar.cc/300?img=2',
    correo: 'compañero@email.com', github: 'https://github.com/compañero',
    linkedin: 'https://linkedin.com/in/compañero', activo: true
  }
];

const MOCK_PROYECTOS: Proyecto[] = [
  {
    id: 1, slug: 'proyecto-uno', nombre: 'Proyecto Uno',
    descripcionBreve: 'App web fullstack con Angular y Node.',
    descripcionCompleta: 'Descripción detallada...',
    imagen: 'https://picsum.photos/seed/p1/600/400',
    tipo: 'academico', tecnologias: ['Angular', 'Node', 'Firebase'],
    repositorio: 'https://github.com', demo: 'https://demo.com',
    destacado: true, programadores: [1, 2]
  },
  {
    id: 2, slug: 'proyecto-dos', nombre: 'Proyecto Dos',
    descripcionBreve: 'Dashboard de análisis con charts.',
    descripcionCompleta: 'Descripción detallada...',
    imagen: 'https://picsum.photos/seed/p2/600/400',
    tipo: 'personal', tecnologias: ['Angular', 'Chart.js'],
    repositorio: 'https://github.com', demo: '',
    destacado: true, programadores: [1]
  },
  {
    id: 3, slug: 'proyecto-tres', nombre: 'Proyecto Tres',
    descripcionBreve: 'API REST con autenticación JWT.',
    descripcionCompleta: 'Descripción detallada...',
    imagen: 'https://picsum.photos/seed/p3/600/400',
    tipo: 'laboral', tecnologias: ['Node', 'Express', 'PostgreSQL'],
    repositorio: 'https://github.com', demo: '',
    destacado: false, programadores: [2]
  }
];

const MOCK_SERVICIOS: Servicio[] = [
  { id: 1, nombre: 'Desarrollo Frontend', icono: 'monitor',
    descripcion: 'Interfaces modernas con Angular y Tailwind.' },
  { id: 2, nombre: 'Desarrollo Backend', icono: 'server',
    descripcion: 'APIs REST robustas y escalables.' },
  { id: 3, nombre: 'Diseño de interfaces', icono: 'palette',
    descripcion: 'UX centrada en el usuario.' }
];

// Veras cambias el USE_MOCK a false para consumir de strapi, pero mientras lo dejas en true para seguir desarrollando con datos mockeados sin depender del backend 
const USE_MOCK = true;  

@Injectable({ providedIn: 'root' })
export class StrapiService {
  private http = inject(HttpClient);
  private base = environment.strapiUrl;
  // Estados reactivos para programadores, proyectos y servicios con modelos
  programadores = signal<Programador[]>([]);
  proyectos     = signal<Proyecto[]>([]);
  servicios     = signal<Servicio[]>([]);
  cargando      = signal<boolean>(false);


  destacados = computed(() =>
    this.proyectos().filter(p => p.destacado)
  );
  // Funciones para obtener programadores y proyectos por el nombre o slug
  getPorSlug(slug: string) {
    return computed(() =>
      this.programadores().find(p => p.slug === slug)
    );
  }

  proyectosDeProgramador(id: number) {
    return computed(() =>
      this.proyectos().filter(p => p.programadores.includes(id))
    );
  }

  // Esta madre es la función asincrona llamada por homepage para cargar todo desde strapi o usar los mocks
  async cargarTodo(): Promise<void> {
    this.cargando.set(true);
    if (USE_MOCK) {
  // Simula una carga asincrona con un timeout, pero toma los datos de los arrays mockeados
      await new Promise(r => setTimeout(r, 300));
      this.programadores.set(MOCK_PROGRAMADORES);
      this.proyectos.set(MOCK_PROYECTOS);
      this.servicios.set(MOCK_SERVICIOS);
    } else {
 // Cuando construyas el backend, elimina el condicional if y la función cargue directamente. Ahi tu le ves.
      const [devs, projs, servs] = await Promise.all([
        this.http.get<{data: Programador[]}>(`${this.base}/api/programadores`).toPromise(),
        this.http.get<{data: Proyecto[]}>(`${this.base}/api/proyectos`).toPromise(),
        this.http.get<{data: Servicio[]}>(`${this.base}/api/servicios`).toPromise(),
      ]);
      this.programadores.set(devs?.data ?? []);
      this.proyectos.set(projs?.data ?? []);
      this.servicios.set(servs?.data ?? []);
    }
    this.cargando.set(false);
  }
}