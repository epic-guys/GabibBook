import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AuthUtilsService } from 'src/app/common/services/auth/auth-utils.service';
import { AuthService } from 'src/app/common/services/auth/auth.service';
import { LocalStorageService } from 'src/app/common/services/storage/local-storage.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements AfterViewInit {
  @ViewChild('signin') cmp!: ElementRef;
  LoggedIn: boolean = false;
  username: string = '';

  constructor(
    private authService: AuthService,
    private storageService: LocalStorageService,
  ) {
    this.LoggedIn = this.authService.isAuthenticated();
    this.username = this.storageService.getUserName();
  }
  
  generateRandomColor(): string {
    const colors = ["red","blue","yellow","green"];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }

  ngAfterViewInit(): void {
    this.cmp.nativeElement.classList.add("color-"+this.generateRandomColor());
  }
  
  randomColor = this.generateRandomColor();
}
