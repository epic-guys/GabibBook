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

  /*user = {
    name: 'John Doe',
    email: 'doe@example.com',
    address: '1234 Main St',
    city: 'Springfield',
    nation: 'USA',
    paymentMethods: [
      {
        id: 1,
        name: 'visa',
        number: '1234567890',
        expiration: '12/22',
        type: 'visa',
        fullName: 'John Doe'
      },
      {
        id: 2,
        name: 'mastercard',
        number: '0987654321',
        expiration: '12/23',
        type: 'mastercard',
        fullName: 'John Doe'
      },
      {
        id: 3,
        name: 'amex',
        number: '1357924680',
        expiration: '12/24',
        type: 'amex',
        fullName: 'John Doe'
      },
      {
        id: 4,
        name: 'discover',
        number: '2468013579',
        expiration: '12/25',
        type: 'discover',
        fullName: 'John Doe'
      }
    ]
  };*/

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
