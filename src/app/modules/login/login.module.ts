import { NgModule } from '@angular/core';
import { LoginRoutingModule } from './login-routing.module';
import * as _components from './components';
import { CommonModule } from '@angular/common';

const COMPONENTS = [_components.IconGoogleComponent, _components.LoginComponent];

@NgModule({
  declarations: COMPONENTS,
  imports: [CommonModule, LoginRoutingModule],
})
export class LoginModule {}
