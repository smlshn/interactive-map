import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContinentRoutingModule } from './continent-routing.module';
import * as _components from './components';
import * as _directives from './directives';

const COMPONENTS = [_components.ContinentComponent];

const DIRECTIVES = [_directives.ImgFallbackDirective];

@NgModule({
  declarations: [...COMPONENTS, ...DIRECTIVES],
  imports: [CommonModule, ContinentRoutingModule],
})
export class ContinentModule {}
