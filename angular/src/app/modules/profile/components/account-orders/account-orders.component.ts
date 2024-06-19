import { Component } from '@angular/core';
import { PurchaseService } from 'src/app/common/services/purchases/purchase.service';
import { LocalStorageService } from 'src/app/common/services/storage/local-storage.service';

@Component({
  selector: 'app-account-orders',
  templateUrl: './account-orders.component.html',
  styleUrls: ['./account-orders.component.scss']
})
export class AccountOrdersComponent {
  purchases: any;
  purchasesLoading = true;
  constructor(private purchaseService: PurchaseService, private localstorage: LocalStorageService) { }

  ngOnInit(){

    const uid = this.localstorage.getUserId();

    const buyerObserver = { 
      next : (res: any) => {
        this.purchasesLoading = false;
        this.purchases = res;
      }, 
      error : (error: any) => {
        console.error(error);
      }
    }

    this.purchaseService.getPurchasesAsBuyer(uid).subscribe(buyerObserver);
  }
}
