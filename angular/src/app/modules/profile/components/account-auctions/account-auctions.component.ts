import { Component } from '@angular/core';
import { PurchaseService } from 'src/app/common/services/purchases/purchase.service';
import { LocalStorageService } from 'src/app/common/services/storage/local-storage.service';

@Component({
  selector: 'app-account-auctions',
  templateUrl: './account-auctions.component.html',
  styleUrls: ['./account-auctions.component.scss']
})
export class AccountAuctionsComponent {
  purchasesAsSeller: any;
  purchasesAsSellerLoading = true;
  constructor(private purchaseService: PurchaseService, private localstorage: LocalStorageService) { }

  ngOnInit(){

    const uid = this.localstorage.getUserId();

    const sellerObserver = { 
      next : (res: any) => {
        this.purchasesAsSellerLoading = false;
        this.purchasesAsSeller = res;
      }, 
      error : (error: any) => {
        console.error(error);
      }
    }

    this.purchaseService.getPurchasesAsSeller(uid).subscribe(sellerObserver);
  }
}
