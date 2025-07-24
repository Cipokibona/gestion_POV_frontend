import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Home } from './components/home/home';

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
];
