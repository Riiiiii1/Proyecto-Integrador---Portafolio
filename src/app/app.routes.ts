import { Routes } from '@angular/router';
import { HomePage } from './features/home/pages/home-page/home-page';
import { LoginPage } from './features/auth/pages/login-page/login-page';
import { RegisterPage } from './features/auth/pages/register-page/register-page';
import { NuevaSolicitudPage } from './features/solicitudes/pages/nueva-solicitud-page/nueva-solicitud-page';
import { ListaSolicitudesPage } from './features/solicitudes/pages/lista-solicitudes-page/lista-solicitudes-page';
import { PanelPage } from './features/panel/pages/panel-page/panel-page';
import { PerfilPage } from './features/perfil/pages/perfil-page/perfil-page';
import { ProyectosPage } from './features/proyectos/pages/proyectos-page/proyectos-page';

// Importamos los nuevos Guards
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
    { path: '', component: HomePage },
    { path: 'perfil/:slug', component: PerfilPage },
    
    // Rutas protegidas para que no entre si ya está logueado
    { path: 'login', component: LoginPage, canActivate: [guestGuard] },
    { path: 'register', component: RegisterPage, canActivate: [guestGuard] },
    
    // El cliente debe estar logueado para enviar una solicitud
    { path: 'solicitudes/nueva', component: NuevaSolicitudPage, canActivate: [authGuard] },
    { path: 'solicitudes/mis', component: ListaSolicitudesPage, canActivate: [authGuard] },
    
    // Solo ustedes (programadores) entran al panel
    { path: 'panel', component: PanelPage, canActivate: [adminGuard] },
    
    { path: 'proyectos', component: ProyectosPage },
    { path: '**', redirectTo: '' }
];