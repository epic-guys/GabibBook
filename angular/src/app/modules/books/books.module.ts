import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyMaterialModule } from 'src/app/common/my-material/my-material.module';
import { BookspageComponent } from './components/bookspage/bookspage.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';

import { RouterModule } from '@angular/router';

import { SearchModule } from '../search/search.module';
import { NavbarModule } from '../navbar/navbar.module';
import { ComponentsModule } from 'src/app/common/components/components.module';
import { OfferCardComponent } from './components/book-details/offer-card/offer-card.component';
import { PipesModule } from 'src/app/common/pipes/pipes.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    BookspageComponent,
    BookDetailsComponent,
    OfferCardComponent
  ],
  imports: [
    CommonModule,
    MyMaterialModule,
    NavbarModule,
    SearchModule,
    ComponentsModule,
    PipesModule,
    ReactiveFormsModule,
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
