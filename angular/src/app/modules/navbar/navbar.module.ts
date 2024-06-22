import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MyMaterialModule } from 'src/app/common/my-material/my-material.module';
import { RouterModule } from '@angular/router';
import { NotificationDialogComponent } from './components/notification-dialog/notification-dialog.component';

@NgModule({
  declarations: [
    NavbarComponent,
    NotificationDialogComponent
  ],
  imports: [
    CommonModule,
    MyMaterialModule,
    RouterModule
  ],
  exports: [
    NavbarComponent
  ]
})
export class NavbarModule { }
