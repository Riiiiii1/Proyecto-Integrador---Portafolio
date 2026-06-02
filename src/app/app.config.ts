import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

// Importaciones de Firebase añadidas
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

// Las llaves de tu proyecto en Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCiUcDxPnAoLRlenoxBgDqY1yNdT-gBvg4",
  authDomain: "icc-proyectointegrador.firebaseapp.com",
  projectId: "icc-proyectointegrador",
  storageBucket: "icc-proyectointegrador.firebasestorage.app",
  messagingSenderId: "723043992118",
  appId: "1:723043992118:web:91af6cdab438bf5f4e0e97",
  measurementId: "G-JTPQ07PJKR"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withInMemoryScrolling({
      scrollPositionRestoration: 'top'
    })),
    provideHttpClient(),
    
    // Proveedores de Firebase añadidos sin borrar los tuyos
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ]
};