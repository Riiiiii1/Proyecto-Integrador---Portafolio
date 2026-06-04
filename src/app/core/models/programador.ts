export interface Programador {
  id: number;
  nombre: string;
  especialidad: string;
  descripcionBreve: string;
  descripcionCompleta: string;
  fotoPerfil: string;       
  correo: string;
  github: string;
  linkedin: string;
  slug: string;              
  activo: boolean;
  stack: string[];             
}