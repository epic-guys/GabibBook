import { Component } from '@angular/core';
import { Book } from 'src/app/common/models/book';
import { UsersService } from 'src/app/common/services/users/users.service';
import { BookService } from 'src/app/common/services/books/book.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StatService } from 'src/app/common/services/stats/stat.service';

@Component({
  selector: 'app-moderation',
  templateUrl: './moderation.component.html',
  styleUrls: ['./moderation.component.scss']
})
export class ModerationComponent {
  booksLoading: boolean = true;
  books: Book[] = [];

  usersLoading: boolean = true;
  users: any[] = [];

  stats_success_loading: boolean = true;
  stats_failed_loading: boolean = true;
  successful: number = 0;
  failed: number = 0;

  constructor(
    private usersservice: UsersService, 
    private booksservice: BookService,
    private statservice: StatService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.searchBooks();
    this.searchUsers();
    this.getStats();
  }

  searchUsersHook($event: any){
    this.searchUsers(String($event));
  }

  banUser(id: string){
    const observer = {
      next: (res: any) => {
        this.snackBar.open('User banned', '', {
          duration: 2000,
        });
        this.searchUsers();
      },
      error: (error: any) => {
        console.error(error);
      },
      complete: () => {
        this.searchUsers();
      }
    }

    this.usersservice.banUser(id).subscribe(observer);
  }

  searchUsers(filter: string = ''){
    this.usersLoading = true;
    const observer = {
      next: (res: any) => {
        this.usersLoading = false;
        this.users = res;
      },
      error: (error: any) => {
        this.usersLoading = false;
        console.error(error);
      },
      complete: () => {
        this.usersLoading = false;
      }
    }

    this.usersservice.getUsers(filter).subscribe(observer);
  }

  searchBooksHook($event: any){
    this.searchBooks(String($event));
  }

  banBook($event: any){
    const observer = {
      next: (res: any) => {
        this.snackBar.open('Book banned', '', {
          duration: 2000,
        });
        this.searchBooks();
      },
      error: (error: any) => {
        console.error(error);
      },
      complete: () => {
        this.searchBooks();
      }
    }

    this.booksservice.deleteBook($event).subscribe(observer);
  }

  searchBooks(filter: string = ''){
    this.booksLoading = true;
    const observer = {
      next: (res: any) => {
        this.booksLoading = false;
        this.books = res.data;
      },
      error: (error: any) => {
        this.booksLoading = false;
        console.error(error);
      },
      complete: () => {
        this.booksLoading = false;
      }
    }

    this.booksservice.searchBooks(filter,0).subscribe(observer);
  }

  getStats(){
    this.stats_success_loading = true;
    this.stats_failed_loading = true;
    
    const success_observer = {
      next: (res: any) => {
        this.successful = res.count;
      },
      error: (error: any) => {
        console.error(error);
      },
      complete: () => {
        this.stats_success_loading = false;
      }
    }

    const failed_observer = {
      next: (res: any) => {
        this.failed = res.count;
      },
      error: (error: any) => {
        console.error(error);
      },
      complete: () => {
        this.stats_failed_loading = false;
      }
    }

    this.statservice.getStats('successful').subscribe(success_observer);
    this.statservice.getStats('unsuccessful').subscribe(failed_observer);
  }
}
