export interface Programador {
  id: number;
  nombre: string;
  especialidad: string;
  descripcionBreve: string;
  descripcionCompleta: string;
  fotoPerfil: string;        // URL de imagen
  correo: string;
  github: string;
  linkedin: string;
  slug: string;              // para la ruta /perfil/:slug
  activo: boolean;
  stack: string[];             
}