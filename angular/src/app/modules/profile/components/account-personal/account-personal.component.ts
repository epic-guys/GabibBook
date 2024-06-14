import { Component } from '@angular/core';
import { PaymentMethod } from 'src/app/common/models/payment-method/paymentMethod';
import { LocalStorageService } from 'src/app/common/services/storage/local-storage.service';
import { UsersService } from 'src/app/common/services/users/users.service';

@Component({
  selector: 'app-account-personal',
  templateUrl: './account-personal.component.html',
  styleUrls: ['./account-personal.component.scss']
})
export class AccountPersonalComponent {
  ajaxLoading = false;

  user: any; 

  constructor(private usersService: UsersService, private storage: LocalStorageService) { }

  ngOnInit() {
    this.ajaxLoading = true;
    const observer = {
      next: (res: any) => {
        this.ajaxLoading = false;
        this.user = res;
      },
      error: (error: any) => {
        this.ajaxLoading = false;
        console.error(error);
      },
      complete: () => {
        this.ajaxLoading = false;
      }
    }

    this.usersService.getUserInfo(this.storage.getUserId()).subscribe(observer);
  }

  deletePaymentMethod(event : Number) {
    console.log('Delete')
    alert('Delete not implemented')
  }

  editPaymentMethod(event : PaymentMethod) {
    console.log('Edit')
    alert('Edit not implemented')
  }

  addPaymentMethod(event : PaymentMethod) {
    console.log('Add')
    alert('Add not implemented')
  }

  edit() {
    console.log('Edit')
    alert('Edit not implemented')
  }

}
