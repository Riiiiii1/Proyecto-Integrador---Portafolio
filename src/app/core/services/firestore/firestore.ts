import { Injectable, inject } from '@angular/core';
import {
  Firestore as FirebaseFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  Timestamp
} from '@angular/fire/firestore';
import { Solicitud } from '../../models/solicitud';

@Injectable({ providedIn: 'root' })
export class Firestore {
  private db = inject(FirebaseFirestore);

  async crearSolicitud(solicitud: Omit<Solicitud, 'id'>): Promise<void> {
    const ref = collection(this.db, 'solicitudes');
    await addDoc(ref, {
      ...solicitud,
      creadoEn: Timestamp.now(),
    });
  }

  async getSolicitudesDeUsuario(uid: string): Promise<Solicitud[]> {
    const ref = collection(this.db, 'solicitudes');
    const q = query(ref, where('uid', '==', uid));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
      creadoEn: (d.data()['creadoEn'] as Timestamp).toDate(),
    } as Solicitud));
  }

  async getSolicitudesDeProgramador(slug: string): Promise<Solicitud[]> {
    const ref = collection(this.db, 'solicitudes');
    const q = query(ref, where('programadorSlug', '==', slug));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
      creadoEn: (d.data()['creadoEn'] as Timestamp).toDate(),
    } as Solicitud));
  }

  async actualizarSolicitud(id: string, datos: Partial<Solicitud>): Promise<void> {
    const ref = doc(this.db, 'solicitudes', id);
    await updateDoc(ref, { ...datos });
  }
}