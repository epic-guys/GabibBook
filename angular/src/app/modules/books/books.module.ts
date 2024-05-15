import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyMaterialModule } from 'src/app/common/my-material/my-material.module';
import { BookspageComponent } from './components/bookspage/bookspage.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';

import { RouterModule, Routes } from '@angular/router';

import { SearchModule } from '../search/search.module';
import { NavbarModule } from '../navbar/navbar.module';
import { ComponentsModule } from 'src/app/common/components/components.module';

@NgModule({
  declarations: [
    BookspageComponent,
    BookDetailsComponent
  ],
  imports: [
    CommonModule,
    MyMaterialModule,
    NavbarModule,
    SearchModule,
    ComponentsModule,
    RouterModule.forChild([
      {
        path: '',
        component: BookspageComponent
      },
      {
        path: ':uuid',
        component: BookDetailsComponent
      }
    ])
  ]
})
export class BooksModule { }
