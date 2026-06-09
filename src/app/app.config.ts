import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient , withFetch} from '@angular/common/http';
import { routes } from './app.routes';


import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyAhe-mym98AhgdnQXQnQSJdmjdQmgYbVCk",
  authDomain: "david-sisa-portafolio.firebaseapp.com",
  projectId: "david-sisa-portafolio",
  storageBucket: "david-sisa-portafolio.firebasestorage.app",
  messagingSenderId: "309992299805",
  appId: "1:309992299805:web:d3923d52effd96c60955f4"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withInMemoryScrolling({
      scrollPositionRestoration: 'top'
    })),
    provideHttpClient(withFetch()),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ]
};