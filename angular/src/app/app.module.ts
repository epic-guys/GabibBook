import { Injectable, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HomepageModule } from './modules/homepage/homepage.module';
import { BooksModule } from './modules/books/books.module';
import { LoginModule } from './modules/login/login.module';
import { RegisterModule } from './modules/register/register.module';
import { ProfileModule } from './modules/profile/profile.module';
import { NotFoundModule } from './modules/not-found/not-found.module';
import { TokenInterceptor } from './common/interceptors/token.interceptor';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { SocketIoModule, SocketIoConfig, Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';

const config: SocketIoConfig = { url: environment.SOCKET_URI, options: {} };

@Injectable()
export class PriceListener extends Socket {
  constructor() {
    super({ url: environment.SOCKET_URI + '/books', options: {} });
  }
}

@Injectable()
export class ChatSocket extends Socket {
  constructor() {
    super({ url: environment.SOCKET_URI + '/chats', options: {} });
  }
}

@Injectable()
export class NotificationListener extends Socket {
  constructor() {
    super({ url: environment.SOCKET_URI + '/notifications', options: {} });
  }
}


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HomepageModule,
    BooksModule,
    LoginModule,
    ProfileModule,
    NotFoundModule,
    RegisterModule,
    SocketIoModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    PriceListener,
    ChatSocket,
    NotificationListener
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
