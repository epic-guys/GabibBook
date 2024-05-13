import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomepageComponent } from './components/homepage/homepage.component';

import { NavbarModule } from '../navbar/navbar.module';
import { SearchModule } from '../search/search.module';
import { ComponentsModule } from '../../common/components/components.module';

import { MyMaterialModule } from 'src/app/common/my-material/my-material.module';
import { RouterModule, Routes } from '@angular/router';


@NgModule({
  declarations: [
    HomepageComponent
  ],
  imports: [
    CommonModule,
    NavbarModule,
    SearchModule,
    MyMaterialModule,
    ComponentsModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomepageComponent
      }
    ])
  ],
  exports: [
    HomepageComponent
  ]
})
export class HomepageModule {}