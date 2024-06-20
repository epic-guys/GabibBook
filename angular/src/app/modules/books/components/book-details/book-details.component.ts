import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from 'src/app/common/models/book';
import { BookService } from 'src/app/common/services/books/book.service';
import { AuthService } from 'src/app/common/services/auth/auth.service';
import { PriceListener } from 'src/app/app.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocalStorageService } from 'src/app/common/services/storage/local-storage.service';
import { last } from 'rxjs';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss']
})
export class BookDetailsComponent {
  ajaxLoading = true;
  isLoggedIn = false;
  ends_in = 0;
  book: Book | null = null;
  hasBid = false;
  lastBid: any;
  isOpen = false;
  holder: any;
  canBid = false;
  role: string = '';
  past = false;

  constructor(
    public bookService: BookService, 
    public acRoute: ActivatedRoute, 
    public auth: AuthService,
    public storage: LocalStorageService,
    public router: Router,
    private listen_price: PriceListener,
    private snackBar: MatSnackBar
  ) {
    this.isLoggedIn = this.auth.isAuthenticated();
  }

  ngOnInit(): void {
    if (this.isLoggedIn) {
      this.role = this.storage.getRole()
      
    }

    const observer = {
      next: (book: any) => {
        this.book = book;
        this.forcePrice();
        this.updateEndsInEverySecond();
      },
      error: (error: any) => {
        this.router.navigate(['/404']);
      },
      complete: () => {
        this.ajaxLoading = false;
      }
    };

    const id = this.acRoute.snapshot.paramMap.get('uuid');
    this.bookService.getBook(id!).subscribe(observer);

    this.listen_price.on('priceUpdate', (data: any) => {
      if (data._id === id) {
        this.hasBid = true;
        if(data.offer){
          this.lastBid = data;
        }
        else{
          console.log('no bid');
          this.lastBid = {offer: {value: this.book!['start_price']}}
        }
      }
    });

    this.listen_price.emit('trackPrice', {
      book: id
    });
  }

  ngOnDestroy() {
    this.listen_price.disconnect();
    clearInterval(this.holder);
  }


  onBid(price: number) {
    const id = this.acRoute.snapshot.paramMap.get('uuid');
    
    const observer = {
      next: (data: any) => {
        this.snackBar.open('Bid successfully placed', 'Close', {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-success']
        });
      },
      error: (error: any) => {
        this.snackBar.open('Error placing bid', 'Close', {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-warn']
        });
      }
    };

    this.bookService.bid(id!, price).subscribe(observer);
  }

  endsInCalc() {
    if (!this.book) {
      this.ends_in = 0;
      return;
    }
    const unixNow = Math.floor(Date.now() / 1000);
    const unixEnd = Math.floor(Date.parse(this.book!.close_date) / 1000);

    this.ends_in = unixEnd - unixNow;
  }

  updateisOpen() {
    if (!this.book) {
      this.isOpen = false;
      return;
    }

    const now = new Date().toISOString();

    if(this.book.open_date > now){
      this.isOpen = false;
      return;
    }

    if(this.book.close_date < now){
      this.isOpen = false;
      this.past = true;
      return;
    }

    this.isOpen = true;
  }

  forcePrice(){
    setTimeout(() => {
      if(this.book){
        if(!this.lastBid){

          const val = this.book.offers.length > 0 ? this.book.offers[this.book.offers.length - 1].value : this.book.start_price;

          this.lastBid = {offer: {value: val}}
          console.log('no bid');
        }
      }
    }, 5000);
  }

  updateEndsInEverySecond() {
    this.holder = setInterval(() => {
      this.endsInCalc();
      this.updateisOpen();
    }, 1000);
  }

}