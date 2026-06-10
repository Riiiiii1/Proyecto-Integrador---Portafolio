export interface Solicitud {
  id?: string;                 // Firestore auto-id
  uid: string;                  // uid de Firebase Auth
  correoUsuario: string;
  nombreSolicitante: string;
  correoSolicitante: string;
  idea: string;
  programadorSlug: string;
  estado: 'pendiente' | 'respondida';
  observacion: string;
  creadoEn: Date;
  
  // Añadimos tu propiedad para que el Navbar pueda controlar las burbujas de notificaciones
  leido?: boolean;              
}