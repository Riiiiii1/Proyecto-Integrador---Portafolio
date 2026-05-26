import { Injectable, signal, inject } from '@angular/core';
import { Solicitud } from '../../models/solicitud';
import { Auth } from '../auth/auth';

@Injectable({
  providedIn: 'root'
})
export class Firestore {
  private auth = inject(Auth);

  // Mock local mientras Firebase no está configurado
  private solicitudesMock: Solicitud[] = [];

  solicitudes = signal<Solicitud[]>([]);

  async crearSolicitud(solicitud: Omit<Solicitud, 'id'>): Promise<void> {
    // Simula delay de red
    await new Promise(r => setTimeout(r, 500));

    const nueva: Solicitud = {
      ...solicitud,
      id: crypto.randomUUID(),
      creadoEn: new Date()
    };

    this.solicitudesMock.push(nueva);
    this.solicitudes.set([...this.solicitudesMock]);
  }

  async getSolicitudesDeUsuario(uid: string): Promise<Solicitud[]> {
    await new Promise(r => setTimeout(r, 300));
    return this.solicitudesMock.filter(s => s.uid === uid);
  }

  async getSolicitudesDeProgramador(slug: string): Promise<Solicitud[]> {
    await new Promise(r => setTimeout(r, 300));
    return this.solicitudesMock.filter(s => s.programadorSlug === slug);
  }

  async actualizarSolicitud(id: string, datos: Partial<Solicitud>): Promise<void> {
    await new Promise(r => setTimeout(r, 300));
    const index = this.solicitudesMock.findIndex(s => s.id === id);
    if (index !== -1) {
      this.solicitudesMock[index] = { ...this.solicitudesMock[index], ...datos };
      this.solicitudes.set([...this.solicitudesMock]);
    }
  }
}