import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '@app/material.module';
import { LoaderComponent } from './loader/loader.component';
import { FooterComponent } from './footer/footer.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

@NgModule({
  imports: [
    FlexLayoutModule,
    MaterialModule,
    CommonModule,
    MDBBootstrapModule.forRoot()
  ],
  declarations: [
    LoaderComponent,
    FooterComponent
  ],
  exports: [
    LoaderComponent,
    FooterComponent
  ],
})
export class SharedModule {}
