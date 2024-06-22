import { Component } from '@angular/core';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from 'src/app/common/services/books/book.service';

@Component({
  selector: 'app-book-edit',
  templateUrl: './book-edit.component.html',
  styleUrls: ['./book-edit.component.scss']
})
export class BookEditComponent {
  book: any | null = null;
  ajaxLoading = true;

  form: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    author: new FormControl('', Validators.required),
    isbn: new FormControl('', Validators.required),
    degree_course: new FormControl('', Validators.required),
  });

  constructor(private route: ActivatedRoute, private bookService: BookService, private router: Router, private snackbar: MatSnackBar) {
    this.route.params.subscribe(params => {
      if (params['uuid']) {

        const observer = {
          next: (book: any) => {
            this.book = book;

            this.form.setValue({
              title: book.title,
              author: book.author,
              isbn: book.isbn,
              degree_course: book.degree_course
            });

            this.ajaxLoading = false;
          },
          error: (error: any) => {
            console.log(error);
          }
        };
        
        this.bookService.getBook(params['uuid']).subscribe(observer);
      }
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const editobserver = {
        next: (book: any) => {
          this.snackbar.open('Book updated successfully','',{
            duration: 2000
          });
          this.router.navigate(['/books', book._id]);
        },
        error: (error: any) => {
          console.log(error);
        }
      };

      if (this.book) {
        this.bookService.updateBook(this.book._id, this.form.value).subscribe(editobserver);
      } else {
      //  this.bookService.createBook(this.form.value).subscribe(observer);
      }
    }
  }
}