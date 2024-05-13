import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HomepageModule } from './modules/homepage/homepage.module';
import { BooksModule } from './modules/books/books.module';
import { LoginModule } from './modules/login/login.module';
import { RegisterModule } from './modules/register/register.module';
import { ProfileModule } from './modules/profile/profile.module';
import { NotFoundModule } from './modules/not-found/not-found.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';

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
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
