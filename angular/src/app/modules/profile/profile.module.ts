import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilepageComponent } from './components/profilepage/profilepage.component';
import { NavbarModule } from '../navbar/navbar.module';
import { MyMaterialModule } from 'src/app/common/my-material/my-material.module';
import { RouterModule } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { AccountPersonalComponent } from './components/account-personal/account-personal.component';
import { AccountOrdersComponent } from './components/account-orders/account-orders.component';
import { AccountAuctionsComponent } from './components/account-auctions/account-auctions.component';
import { PaymentMethodsComponent } from './components/account-personal/payment-methods/payment-methods.component';
import { ComponentsModule } from 'src/app/common/components/components.module';


@NgModule({
  declarations: [
    ProfilepageComponent,
    MenuComponent,
    AccountPersonalComponent,
    AccountOrdersComponent,
    AccountAuctionsComponent,
    PaymentMethodsComponent
  ],
  imports: [
    CommonModule,
    NavbarModule,
    ComponentsModule,
    MyMaterialModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProfilepageComponent,
        children: [
          {
            path: '',
            redirectTo: 'personal',
            pathMatch: 'full'
          },
          {
            path: 'personal',
            component: AccountPersonalComponent
          },
          {
            path: 'orders',
            component: AccountOrdersComponent
          },
          {
            path: 'auctions',
            component: AccountAuctionsComponent
          }
        ]
      }
    ])
  ],
  exports: [
    ProfilepageComponent
  ]
})
export class ProfileModule { }
