export interface Proyecto {
  id: number;
  nombre: string;
  slug: string;
  descripcionBreve: string;
  descripcionCompleta: string;
  imagen: string;
  tipo: 'academico' | 'personal' | 'laboral' | 'simulado';
  tecnologias: string[];
  repositorio: string;
  demo: string;
  destacado: boolean;
  programadores: number[];    // ids de programadores
}


// al final de proyecto.ts
export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  icono: string;
}