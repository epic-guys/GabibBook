import { Component } from '@angular/core';

@Component({
  selector: 'app-account-personal',
  templateUrl: './account-personal.component.html',
  styleUrls: ['./account-personal.component.scss']
})
export class AccountPersonalComponent {
  ajaxLoading = false;

  ngOnInit() {
    console.log('AccountPersonalComponent')
    //this.ajaxLoading = true;
    //make ajax call
  }

  user = {
    name: 'John Doe',
    email: 'doe@example.com',
    address: '1234 Main St',
    city: 'Springfield',
    nation: 'USA'
  };

  edit() {
    console.log('Edit')
    alert('Edit not implemented')
  }

}
