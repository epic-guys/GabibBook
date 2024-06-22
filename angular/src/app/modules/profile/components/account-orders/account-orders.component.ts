import { Component, OnChanges } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { PurchaseService } from 'src/app/common/services/purchases/purchase.service';
import { StatService } from 'src/app/common/services/stats/stat.service';
import { LocalStorageService } from 'src/app/common/services/storage/local-storage.service';

@Component({
  selector: 'app-account-orders',
  templateUrl: './account-orders.component.html',
  styleUrls: ['./account-orders.component.scss']
})
export class AccountOrdersComponent {
  purchases: any;
  PurchasesLoading = true;

  offersLoading = true;
  offers: any;

  showOffers = false;

  constructor(private purchaseService: PurchaseService, private localstorage: LocalStorageService, private statsService: StatService) { }

  statusChanged(event: any) {
    console.log(event);
  }

  onToggleChange(event: MatSlideToggleChange) {
    this.showOffers = event.checked;
  }

  ngOnInit(){

    const uid = this.localstorage.getUserId()

    const buyerObserver = { 
      next : (res: any) => {
        this.purchases = res;
      },
      error : (error: any) => {
        console.error(error);
      },
      complete : () => {
        this.PurchasesLoading = false;
      }
    }

    const offerObserver = {
      next: (res: any) => {
        this.offers = res;
      },
      error: (error: any) => {
        console.error(error);
      },
      complete: () => {
        this.offersLoading = false;
      }
    }

    this.purchaseService.getPurchasesAsBuyer(uid).subscribe(buyerObserver);
    this.statsService.getMyOffers().subscribe(offerObserver);
  }
}
