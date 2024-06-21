import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from 'src/app/common/models/book';
import { BookService } from 'src/app/common/services/books/book.service';
import { AuthService } from 'src/app/common/services/auth/auth.service';
import { ChatSocket, PriceListener } from 'src/app/app.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocalStorageService } from 'src/app/common/services/storage/local-storage.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
  publicChat: string | null = null;
  privateChat: string | null = null;
  publicChatMessages: any[] = [];
  privateChatMessages: any[] = [];
  user_uid = '';
  publicChatForm: FormGroup = new FormGroup({
    message: new FormControl('',
      Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(200)
      ])
    )
  });

  constructor(
    public bookService: BookService, 
    public acRoute: ActivatedRoute, 
    public auth: AuthService,
    public storage: LocalStorageService,
    public router: Router,
    private listen_price: PriceListener,
    private chat: ChatSocket,
    private snackBar: MatSnackBar
  ) {
    this.isLoggedIn = this.auth.isAuthenticated();
  }

  ngOnInit(): void {
    if (this.isLoggedIn) {
      this.role = this.storage.getRole()
      this.user_uid = this.storage.getUserId();
    }

    const observer = {
      next: (book: any) => {
        this.book = book;
        this.startChats();
        this.forceSockets();
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
    this.chat.disconnect();
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
    }this.book['_id']

    if(this.book.close_date < now){
      this.isOpen = false;
      this.past = true;
      return;
    }

    this.isOpen = true;
  }

  forceSockets(){
    setTimeout(() => {
      //this.sendPublicMessage({
      //  chatId: this.publicChat || '',
      //  text: 'ping'
      //});
      if(this.book){
        if(!this.lastBid){

          const val = this.book.offers.length > 0 ? this.book.offers[this.book.offers.length - 1].value : this.book.start_price;

          this.lastBid = {offer: {value: val}}
          console.log('no bid');
        }
      }

      if(!this.publicChat || !this.privateChat){
        this.startChats();
      }
    }, 5000);
  }

  updateEndsInEverySecond() {
    this.holder = setInterval(() => {
      this.endsInCalc();
      this.updateisOpen();
    }, 1000);
  }

  onEdit() {
    this.router.navigate(['/books/edit', this.book!._id]);
  }

  onBan(){
    
    const observer = {
      next: (res: any) => {
        this.snackBar.open('Book banned', '', {
          duration: 2000,
        });
        this.router.navigate(['/']);
      },
      error: (error: any) => {
        console.error(error);
      },
      complete: () => {
        this.router.navigate(['/']);
      }
    }

    this.bookService.deleteBook(String(this.book?._id)).subscribe(observer);
  }

  startChats(){
    if(!this.book){
      return;
    }

    this.chat.emit('auth', {
      jwt: this.storage.getAuth().accessToken.jwt
    });

    const observer = {
      next: (data: any) => {
        this.publicChat = data._id;
        this.chat.emit('subscribeChat', {
          chatId: this.publicChat
        });

        this.chat.on('message', (data: any) => {
          console.log(data);
          if(data._id === this.publicChat){
            console.log('public chat');
            if(data.messages.length > 1){
              this.publicChatMessages = [this.publicChatMessages, ...data.messages];
            }
            else{
              console.log('adding messages');
              this.publicChatMessages = [...new Set([...this.publicChatMessages, ...data.messages])];
            }

            setTimeout(() => {
              const element = document.getElementById('public-chat');
              if(element){
                element.scrollTop = element.scrollHeight;
              }
            }, 100);
          }
          else if(data._id === this.privateChat){
            console.log('private chat');

            this.privateChatMessages = [this.privateChatMessages];
          }
        });
      },
      error: (error: any) => {
        console.error("could not get public chat");
        console.error(error);
      }
    };

    this.bookService.getChat(this.book._id).subscribe(observer);

    if(!this.publicChat){
      return;
    }
  }

  onPublicChatSubmit(){
    if(!this.publicChatForm.valid){
      return;
    }

    this.sendPublicMessage({
      chatId: this.publicChat!,
      text: this.publicChatForm.value.message
    });

    this.publicChatForm.reset();
  }

  sendPublicMessage(message: {
    chatId: string,
    text: string
  }){
    if(!this.publicChat){
      console.error('no public chat');
      return;
    }

    this.chat.emit('message', message);
  }
}