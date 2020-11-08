import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import * as _components from './components';
import { LayoutComponent } from '../shared/components';
import { CountryFlagsResolver, GeoDataResolver } from '../shared/resolvers';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: _components.DetailComponent,
        resolve: [GeoDataResolver],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [GeoDataResolver, CountryFlagsResolver],
})
export class DetailRoutingModule {}
