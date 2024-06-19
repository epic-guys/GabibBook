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
import { PaymentMethodComponent } from './components/account-personal/payment-methods/payment-method/payment-method.component';
import { InviteComponent } from './components/invite/invite.component';
import { isAdminGuard } from 'src/app/common/guards/is-admin.guard';
import { isStudentGuard } from 'src/app/common/guards/is-student.guard';
import { PipesModule } from 'src/app/common/pipes/pipes.module';
import { ModerationComponent } from './components/moderation/moderation.component';
import { BookSearchComponent } from './components/moderation/book-search/book-search.component';
import { UserSearchComponent } from './components/moderation/user-search/user-search.component';
import { UserCardComponent } from './components/moderation/user-card/user-card.component';
import { BookCardComponent } from './components/moderation/book-card/book-card.component';
import { BookFilterComponent } from './components/moderation/book-filter/book-filter.component';
import { FormsModule } from '@angular/forms';
import { isLoggedGuard } from 'src/app/common/guards/is-logged.guard';
import { BookCardAuctionsComponent } from './components/account-auctions/book-card-auctions/book-card-auctions.component';

@NgModule({
  declarations: [
    ProfilepageComponent,
    MenuComponent,
    AccountPersonalComponent,
    AccountOrdersComponent,
    AccountAuctionsComponent,
    PaymentMethodsComponent,
    PaymentMethodComponent,
    InviteComponent,
    ModerationComponent,
    BookSearchComponent,
    UserSearchComponent,
    UserCardComponent,
    BookCardComponent,
    BookFilterComponent,
    BookCardAuctionsComponent
  ],
  imports: [
    CommonModule,
    NavbarModule,
    ComponentsModule,
    MyMaterialModule,
    FormsModule,
    PipesModule,
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
            canActivate: [isLoggedGuard],
            path: 'personal',
            component: AccountPersonalComponent
          },
          {
            canActivate: [isStudentGuard],
            path: 'orders',
            component: AccountOrdersComponent
          },
          {
            canActivate: [isStudentGuard],
            path: 'auctions',
            component: AccountAuctionsComponent
          },
          {
            canActivate: [isAdminGuard],
            path: 'invite',
            component: InviteComponent
          },
          {
            canActivate: [isAdminGuard],
            path: 'moderation',
            component: ModerationComponent
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
