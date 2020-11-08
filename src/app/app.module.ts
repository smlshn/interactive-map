import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppFirebaseModule } from './app-firebase.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import * as _states from '@states';
import { NgxsModule } from '@ngxs/store';
import { OverlayModule } from '@angular/cdk/overlay';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpCacheInterceptor } from '@interceptors';

const STATES = [_states.GeoState];

const MODULES = [
  AppRoutingModule,
  AppFirebaseModule,
  FormsModule,
  ReactiveFormsModule,
  OverlayModule,
  NgxsModule.forRoot(STATES),
];

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, BrowserAnimationsModule, HttpClientModule, ...MODULES],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpCacheInterceptor,
      multi: true,
    },
  ],
})
export class AppModule {}
