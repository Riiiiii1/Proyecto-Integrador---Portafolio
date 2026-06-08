import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Programador } from '../../models/programador';
import { Proyecto, Servicio } from '../../models/proyecto';
import { environment } from '../../../../environments/environment';
import { Observable, map } from 'rxjs'; // <-- Añadido para las peticiones de solicitudes

// hecho por el GEMINI (ESTOS DATOS DEBES CONSUMIR DESDE STRAPI CARLOS)
const MOCK_PROGRAMADORES: Programador[] = [
  {
    // DATOS DE DAVID 
    id: 1, slug: 'david-sisa',
    nombre: 'David Esteban Sisa Buestan', especialidad: 'Full Stack Developer',
    descripcionBreve: 'Desarrollador apasionado por crear soluciones web completas.',
    descripcionCompleta: 'bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla',
    fotoPerfil: '01Sisa.png',
    correo: 'desbskull@email.com', github: 'https://github.com/riiiiii1',
    linkedin: 'https://linkedin.com/in/david-esteban-sisa', activo: true,
    stack: ['Angular', 'Node', 'Firebase']
  },
  {
    // DATOS DE CARLOS
    id: 2, slug: 'carlos-gordillo',
    nombre: 'Carlos Antonio Gordillo Tenemaza', especialidad: 'Full Stack Developer',
    descripcionBreve: 'Estudiante de Ingeniería en Computación. Especialista en seguridad backend, optimización de bases de datos y diseño de interfaces limpias.',
    descripcionCompleta: 'Soy estudiante de quinto ciclo de Ingeniería en Computación con un fuerte enfoque en el rendimiento y la escalabilidad. En mi experiencia profesional colaborando con Territorios Inteligentes, me he especializado en la reingeniería de sistemas: desde el rediseño minimalista y centrado en la UX del Portal Ciudadano usando Angular, hasta la robustez del backend. He implementado capas de seguridad estrictas en servicios REST y SOAP, manejo automático de recursos, validación de tokens y optimización de consultas SQL para sistemas de recaudación y trámites.',
    fotoPerfil: '02Gordillo.jpeg', 
    correo: 'antoniogordillo.1808@gmail.com', 
    github: 'https://github.com/antonikr8s', 
    linkedin: 'https://www.linkedin.com/in/carlos-antonio-gordillo-tenemaza-828540281', 
    activo: true,
    stack: ['Angular', 'Java', 'Node', 'PostgreSQL']
  }
];

// ============================================================
// REEMPLAZA SOLO EL BLOQUE const MOCK_PROYECTOS en strapi.ts
// ============================================================

const MOCK_PROYECTOS: Proyecto[] = [
  {
    // Proyecto inventado (ambos participan) — sin repositorio real
    id: 1, slug: 'proyecto-uno', nombre: 'Proyecto Uno',
    descripcionBreve: 'App web fullstack con Angular y Node.',
    descripcionCompleta: 'Descripción detallada...',
    imagen: 'https://picsum.photos/seed/p1/600/400',
    tipo: 'academico', tecnologias: ['Angular', 'Node', 'Firebase'],
    repositorio: '', // Sin repo real → no muestra el botón GitHub
    demo: 'https://demo.com',
    destacado: true, programadores: [1, 2]
  },
  {
    // Proyecto de David — GitHub apunta al perfil de David
    id: 2, slug: 'proyecto-dos', nombre: 'Proyecto Dos',
    descripcionBreve: 'Dashboard de análisis con charts.',
    descripcionCompleta: 'Descripción detallada...',
    imagen: 'https://picsum.photos/seed/p2/600/400',
    tipo: 'personal', tecnologias: ['Angular', 'Chart.js'],
    repositorio: 'https://github.com/riiiiii1', // Perfil de David
    demo: '',
    destacado: true, programadores: [1]
  },
  {
    // Proyecto de Carlos (Territorios Inteligentes) — GitHub apunta al perfil de Carlos
    id: 3, slug: 'portal-ciudadano', nombre: 'Portal Ciudadano & Banca Core',
    descripcionBreve: 'Rediseño UX/UI e implementación de seguridad en servicios REST/SOAP.',
    descripcionCompleta: 'Proyecto de modernización para Territorios Inteligentes. En el Frontend, rediseñé la interfaz del portal de trámites aplicando estandarización de componentes (Cards), validaciones reactivas en tiempo real y nuevos sistemas de CAPTCHA visual. En el Backend, reestructuré la lógica de servicios bancarios (REST/SOAP) implementando cierres automáticos de conexión (try-with-resources), validación de accesos por token, control de transacciones (rollback) y optimización de filtros directamente en SQL.',
    imagen: 'https://picsum.photos/seed/carlos1/600/400',
    tipo: 'laboral', tecnologias: ['Angular', 'Java', 'SQL', 'SOAP/REST'],
    repositorio: 'https://github.com/antonikr8s', // Perfil de Carlos
    demo: '',
    destacado: true, programadores: [2]
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
const DATOS = true;  

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
    if (DATOS) {
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

  // =================================================================================
  // NUEVOS MÉTODOS PARA SOLICITUDES (Los formularios de contacto de los clientes)
  // =================================================================================

  /**
   * Guarda una nueva solicitud enviada por un cliente en Strapi.
   */
  crearSolicitud(datos: any): Observable<any> {
    // Fíjate que ahora dice "solicituds"
    return this.http.post<any>(`${this.base}/api/solicituds`, { data: datos }); 
  }

  /**
   * Trae exclusivamente las solicitudes que el cliente logueado ha enviado (Pestaña "Solicitudes Enviadas").
   */
  getSolicitudesDeCliente(correo: string): Observable<any[]> {
    return this.http.get<any>(`${this.base}/api/solicituds?filters[correoSolicitante][$eq]=${correo}&populate=*`).pipe(
      map(response => response.data.map((item: any) => {
        const dataReal = item.attributes ? item.attributes : item;
        return {
          // EL SECRETO: Si existe un documentId (Strapi moderno), lo usamos. Si no, usamos el id clásico.
          id: item.documentId || item.id, 
          nombreSolicitante: dataReal.nombreSolicitante,
          correoSolicitante: dataReal.correoSolicitante,
          programadorSlug: dataReal.programadorSlug,
          idea: dataReal.idea,
          // Añadimos los nuevos campos para que Angular también los lea
          estado: dataReal.estado,
          observacion: dataReal.observacion,
          leido: dataReal.leido,
          creadoEn: dataReal.createdAt || item.createdAt 
        };
      }))
    );
  }

  /**
   * Trae las solicitudes asignadas a un programador (Pestaña "Mis Solicitudes" del Panel).
   */
  getSolicitudesDeProgramador(slug: string): Observable<any[]> {
    return this.http.get<any>(`${this.base}/api/solicituds?filters[programadorSlug][$eq]=${slug}&populate=*`).pipe(
      map(response => response.data.map((item: any) => {
        const dataReal = item.attributes ? item.attributes : item;
        return {
          // Extraemos el identificador correcto para poder actualizar después
          id: item.documentId || item.id, 
          nombreSolicitante: dataReal.nombreSolicitante,
          correoSolicitante: dataReal.correoSolicitante,
          programadorSlug: dataReal.programadorSlug,
          idea: dataReal.idea,
          estado: dataReal.estado,
          observacion: dataReal.observacion,
          creadoEn: dataReal.createdAt || item.createdAt
        };
      }))
    );
  }

  /**
   * Modifica y actualiza una propuesta existente en la base de datos de Strapi.
   * Utiliza el comando PUT apuntando al número de identificación único de la solicitud.
   */
  actualizarSolicitud(id: number | string, datos: any): Observable<any> {
    // Strapi requiere que los datos a modificar vengan envueltos dentro de un objeto llamado 'data'
    return this.http.put<any>(`${this.base}/api/solicituds/${id}`, { data: datos });
  }
  
}