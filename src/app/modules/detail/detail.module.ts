import { NgModule } from '@angular/core';
import { DetailRoutingModule } from './detail-routing.module';
import * as _components from './components';
import { SharedModule } from '../shared/shared.module';

const COMPONENTS = [
  _components.ContinentCardComponent,
  _components.DetailComponent,
  _components.NoteModalComponent,
  _components.WorldMapComponent,
];

@NgModule({
  declarations: COMPONENTS,
  imports: [DetailRoutingModule, SharedModule],
})
export class DetailModule {}
