import { NgModule } from '@angular/core';
import * as _components from './components';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PortalModule } from '@angular/cdk/portal';
import { OverlayModule } from '@angular/cdk/overlay';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const COMPONENTS = [
  _components.AutoCompleteComponent,
  _components.ContentResolverComponent,
  _components.CountryEditComponent,
  _components.HeaderComponent,
  _components.LayoutComponent,
  _components.ModalBodyComponent,
  _components.ModalComponent,
  _components.ModalFooterComponent,
  _components.ModalHeaderComponent,
  _components.OverlayComponent,
  _components.OverlayModalComponent,
  _components.ProfileCardComponent,
  _components.SearchComponent,
];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    PortalModule,
    OverlayModule,
  ],
  exports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, ...COMPONENTS],
})
export class SharedModule {}
