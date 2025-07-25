import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Home } from './components/home/home';
import { ListPaniers } from './components/paniers/list-paniers/list-paniers';
import { ListRequests } from './components/requests/list-requests/list-requests';
import { ListUsers } from './components/users/list-users/list-users';
import { FormUser } from './components/users/form-user/form-user';
import { ListPov } from './components/POV/list-pov/list-pov';
import { DetailPov } from './components/POV/detail-pov/detail-pov';
import { FormPov } from './components/POV/form-pov/form-pov';

export const routes: Routes = [
  {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path:'login',
        title: 'Login Page',
        component: Login,
    },
    {
        path:'home',
        title: 'Home Page',
        component: Home,
      },
      {
        path:'list-users',
        title: 'Liste des utilisateurs',
        component: ListUsers,
      },
      {
        path:'form-user',
        title: 'Formulaire pour un utilisateur',
        component: FormUser,
      },
      {
        path:'form-user/:id',
        title: 'Modification utilisateur',
        component: FormUser,
      },
      {
        path:'list-pov',
        title: 'Liste des points de vente',
        component: ListPov,
      },
      {
        path:'list-pov/:id',
        title: 'point de vente',
        component: DetailPov,
      },
      {
        path:'form-pov',
        title: 'Formulaire pour un point de vente',
        component: FormPov,
      },
      {
        path:'form-pov/:id',
        title: 'Modifier un point de vente',
        component: FormPov,
      },
      {
        path:'paniers-agent',
        title: 'Paniers Agent',
        component: ListPaniers,
      },
      {
        path:'list-request',
        title: 'Request Agent',
        component: ListRequests,
      },
];
