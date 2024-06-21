import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-book-create',
  templateUrl: './book-create.component.html',
  styleUrls: ['./book-create.component.scss']
})
export class BookCreateComponent {
  coverfile: File | null = null;

  form: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    isbn : new FormControl('', [Validators.required]),
    author: new FormControl('', [Validators.required]),
    start_price: new FormControl('', [Validators.required]),
    degree_course: new FormControl('', [Validators.required]),
    close_date: new FormControl('', [Validators.required]),
    open_date: new FormControl('', [Validators.required]),
  });

  constructor() { }

  onSubmit() {
    //TODO: check if form is valid
    //TODO: send form data to backend
  }

  onFileChange(event: any) {
    console.log('file change');
    console.log(event);
    //TODO: check if file is an image if not reset the input
    this.coverfile = event.target.files[0];
  }
}
