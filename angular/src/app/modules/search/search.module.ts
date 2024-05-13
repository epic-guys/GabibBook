import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchbarComponent } from './components/searchbar/searchbar.component';

import { MyMaterialModule } from 'src/app/common/my-material/my-material.module';
import { FilterDialogComponent } from './components/filter-dialog/filter-dialog.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SearchbarComponent,
    FilterDialogComponent
  ],
  imports: [
    CommonModule,
    MyMaterialModule,
    FormsModule
  ],
  exports: [
    SearchbarComponent
  ]
})
export class SearchModule { }
