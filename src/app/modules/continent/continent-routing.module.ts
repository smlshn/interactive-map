import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import * as _components from './components';
import { CountryFlagsResolver, GeoDataResolver } from '../shared/resolvers';
import { LayoutComponent } from '../shared/components';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    data: {
      searchVisible: false,
    },
    children: [
      {
        path: ':shortCode',
        component: _components.ContinentComponent,
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
export class ContinentRoutingModule {}
