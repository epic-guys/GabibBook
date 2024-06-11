import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AuthService } from 'src/app/common/services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements AfterViewInit {
  @ViewChild('signin') cmp!: ElementRef;
  LoggedIn: boolean = false;

  constructor(private authService: AuthService) {
    this.LoggedIn = this.authService.isAuthenticated();
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
