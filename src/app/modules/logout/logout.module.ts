import { NgModule } from '@angular/core';
import { LogoutRoutingModule } from './logout-routing.module';
import * as _components from './components';
import { RouterModule } from '@angular/router';

const COMPONENTS = [_components.LogoutComponent];

@NgModule({
  declarations: COMPONENTS,
  imports: [LogoutRoutingModule, RouterModule],
})
export class LogoutModule {}
