import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookCardComponent } from './book-card/book-card.component';

import { MyMaterialModule } from '../my-material/my-material.module';
import { PaginatorComponent } from './paginator/paginator.component';
import { LoaderComponent } from './loader/loader.component';

@NgModule({
  declarations: [BookCardComponent, PaginatorComponent, LoaderComponent],
  imports: [
    CommonModule,
    MyMaterialModule
  ],
  exports: [BookCardComponent, PaginatorComponent, LoaderComponent]
})
export class ComponentsModule { }
