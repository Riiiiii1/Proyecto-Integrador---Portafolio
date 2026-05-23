import { Routes } from '@angular/router';
import { HomePage } from './features/home/pages/home-page/home-page';
import { LoginPage } from './features/auth/pages/login-page/login-page';
import { RegisterPage } from './features/auth/pages/register-page/register-page';
import { NuevaSolicitudPage } from './features/solicitudes/pages/nueva-solicitud-page/nueva-solicitud-page';
import { ListaSolicitudesPage } from './features/solicitudes/pages/lista-solicitudes-page/lista-solicitudes-page';
import { PanelPage } from './features/panel/pages/panel-page/panel-page';
import { PerfilPage } from './features/perfil/pages/perfil-page/perfil-page';
import { ProyectosPage } from './features/proyectos/pages/proyectos-page/proyectos-page';
export const routes: Routes = [
    {   
        path:'', 
        component: HomePage
    },
    {
        path:'perfil/:slug',
        component: PerfilPage
    },
    {
        path:'login',
        component: LoginPage
    },
    {
        path:'register',
        component: RegisterPage
    },
    {
        path:'solicitudes/nueva',
        component: NuevaSolicitudPage
    },
    {
        path:'solicitudes/mis',
        component: ListaSolicitudesPage

    },
    {
        path:'panel',
        component: PanelPage
    },
    {
        path:'proyectos',
        component: ProyectosPage
    },
    {
        path:'**',
        redirectTo:''
    }
];
