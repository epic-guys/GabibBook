import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { BookService } from 'src/app/common/services/books/book.service';

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
    reserve_price: new FormControl('', [Validators.required]),
    degree_course: new FormControl('', [Validators.required]),
    close_date: new FormControl('', [Validators.required]),
    open_date: new FormControl('', [Validators.required]),
  });

  constructor(private bookService: BookService, private snackBar: MatSnackBar, private router: Router) { }

  async onSubmit() {
    if(this.form.invalid) {
      return;
    }

    if(this.form.value.start_price >= this.form.value.reserve_price) {
      this.snackBar.open('Start price must be lower than reserve price', 'Close', {
        duration: 2000,
      });
      return;
    }

    if(this.form.value.open_date >= this.form.value.close_date) {
      this.snackBar.open('Open date must be lower than close date', 'Close', {
        duration: 2000,
      });
      return;
    }

    if(this.form.value.open_date < new Date().toISOString()) {
      this.snackBar.open('Open date cannot be in the past', 'Close', {
        duration: 2000,
      });
      return;
    }

    const diff = (new Date().getTimezoneOffset()) * -1;
    const open = new Date(new Date(this.form.value.open_date).getTime() + (diff * 60000));
    const close = new Date(new Date(this.form.value.close_date).getTime() + (diff * 60000));

    let cover_base64 = null;

    if(this.coverfile) {
      cover_base64 = await this.fileToBase64(this.coverfile); 
    }

    const data = {
      title: this.form.value.title,
      isbn: this.form.value.isbn,
      author: this.form.value.author,
      degree_course: this.form.value.degree_course,
      close_date: close,
      open_date: open,
      start_price: this.form.value.start_price,
      reserve_price: this.form.value.reserve_price,
      cover: cover_base64 ? cover_base64 : '',
    }

    const observer = {
      next: (response: any) => {
        console.log('response', response);
        this.snackBar.open('Book created', 'Close', {
          duration: 2000,
        });
        this.router.navigate(['/books/' + response._id]);
      },
      error: (error: any) => {
        console.log('error', error);
        this.snackBar.open('Error creating book', 'Close', {
          duration: 2000,
        });
      }
    }

    this.bookService.createBook(data).subscribe(observer);
  }

  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (error) => {
        console.error('Error: ', error);
        reject(error);
      };
    });
  }

  onFileChange(event: any) {
    if(event.target.files.length === 0) {
      return;
    }

    if(event.target.files[0].type.split('/')[0] !== 'image') {
      console.log('not an image');
      this.snackBar.open('Please select an image', 'Close', {
        duration: 2000,
      });
      event.target.value = '';
      return;
    }
    this.coverfile = event.target.files[0];
  }
}
