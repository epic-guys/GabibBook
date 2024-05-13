import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MyMaterialModule } from 'src/app/common/my-material/my-material.module';

@NgModule({
  declarations: [
    NavbarComponent
  ],
  imports: [
    CommonModule,
    MyMaterialModule
  ],
  exports: [
    NavbarComponent
  ]
})
export class NavbarModule { }
