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
import { MessageComponent } from './components/book-details/message/message.component';
import { BookEditorcreateComponent } from './components/book-editorcreate/book-editorcreate.component';
import { isLoggedGuard } from 'src/app/common/guards/is-logged.guard';
import { isAdminGuard } from 'src/app/common/guards/is-admin.guard';
import { isStudentGuard } from 'src/app/common/guards/is-student.guard';

@NgModule({
  declarations: [
    BookspageComponent,
    BookDetailsComponent,
    OfferCardComponent,
    MessageComponent,
    BookEditorcreateComponent
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
        path: 'edit/:uuid',
        component: BookEditorcreateComponent,
        canActivate: [isLoggedGuard, isAdminGuard]
      },
      {
        path: 'create',
        component: BookEditorcreateComponent,
        canActivate: [isLoggedGuard, isStudentGuard],
      },
      {
        path: ':uuid',
        component: BookDetailsComponent
      },
    ])
  ]
})
export class BooksModule { }
