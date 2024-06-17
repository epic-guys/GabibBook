import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnixToHumanDatePipe } from './unix-to-human-date.pipe';


@NgModule({
  declarations: [
    UnixToHumanDatePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    UnixToHumanDatePipe
  ]
})
export class PipesModule { }
