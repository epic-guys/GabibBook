import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookCardComponent } from './book-card/book-card.component';

import { MyMaterialModule } from '../my-material/my-material.module';
import { PaginatorComponent } from './paginator/paginator.component';

@NgModule({
  declarations: [BookCardComponent, PaginatorComponent],
  imports: [
    CommonModule,
    MyMaterialModule
  ],
  exports: [BookCardComponent, PaginatorComponent]
})
export class ComponentsModule { }
