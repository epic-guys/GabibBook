import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './components/register/register.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MyMaterialModule } from 'src/app/common/my-material/my-material.module';
import { ComponentsModule } from 'src/app/common/components/components.module';


@NgModule({
  declarations: [
    RegisterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MyMaterialModule,
    ComponentsModule,
    RouterModule.forChild([
      {
        path: '',
        component: RegisterComponent
      }
    ])
  ]
})
export class RegisterModule { }
