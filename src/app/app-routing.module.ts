import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const RedirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login']);

const RedirectLoggedInTo = () => redirectLoggedInTo(['/detail']);

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () => import('./modules/login/login.module').then((m) => m.LoginModule),
    canActivate: [AngularFireAuthGuard],
    data: {
      authGuardPipe: RedirectLoggedInTo,
    },
  },
  {
    path: 'logout',
    loadChildren: () => import('./modules/logout/logout.module').then((m) => m.LogoutModule),
  },
  {
    path: 'continent',
    loadChildren: () => import('./modules/continent/continent.module').then((m) => m.ContinentModule),
    canActivate: [AngularFireAuthGuard],
    data: {
      authGuardPipe: RedirectUnauthorizedToLogin,
    },
  },
  {
    path: 'detail',
    loadChildren: () => import('./modules/detail/detail.module').then((m) => m.DetailModule),
    canActivate: [AngularFireAuthGuard],
    data: {
      authGuardPipe: RedirectUnauthorizedToLogin,
    },
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
