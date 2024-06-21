import { Component } from '@angular/core';
import { PurchaseService } from 'src/app/common/services/purchases/purchase.service';
import { LocalStorageService } from 'src/app/common/services/storage/local-storage.service';
import { BookService } from 'src/app/common/services/books/book.service';

@Component({
  selector: 'app-account-auctions',
  templateUrl: './account-auctions.component.html',
  styleUrls: ['./account-auctions.component.scss']
})
export class AccountAuctionsComponent {
  data: any;
  ongoing: any;
  ordersLoading = true;
  ongoingLoading = true;

  constructor(private purchaseService: PurchaseService, private localstorage: LocalStorageService, private booksservice: BookService) { }

  statusChanged(event: any) {
    console.log(event);
  }

  ngOnInit(){

    const uid = this.localstorage.getUserId();

    const sellerObserver = { 
      next : (res: any) => {
        this.data = res;
        this.ordersLoading  = false;
      }, 
      error : (error: any) => {
        console.error(error);
      }
    }

    const ongoingObserver = {
      next : (res: any) => {
        this.ongoing = res.data;
        this.ongoingLoading = false;  
      }, 
      error : (error: any) => {
        console.error(error);
      }
    }
    const nickname = this.localstorage.getAuthInfo().nickname;
    const filter = "OWNER::" + nickname;

    this.purchaseService.getPurchasesAsSeller(uid).subscribe(sellerObserver);
    this.booksservice.searchBooks(filter,0).subscribe(ongoingObserver);
  }
}
