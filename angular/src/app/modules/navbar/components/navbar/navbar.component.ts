import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationListener } from 'src/app/app.module';
import { AuthService } from 'src/app/common/services/auth/auth.service';
import { LocalStorageService } from 'src/app/common/services/storage/local-storage.service';
import { NotificationDialogComponent } from '../notification-dialog/notification-dialog.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements AfterViewInit {
  @ViewChild('signin') cmp!: ElementRef;
  LoggedIn: boolean = false;
  username: string = '';
  notifications: any[] = [];

  constructor(
    private authService: AuthService,
    private storageService: LocalStorageService,
    private notificationListener: NotificationListener,
    public storage: LocalStorageService,
    private dialog: MatDialog
  ) {
    this.LoggedIn = this.authService.isAuthenticated();
    this.username = this.storageService.getUserName();
  }

  openNotificationDialog(event: MouseEvent) {
    const dialogConfig = {
      position: {
        left: `${event.clientX - 150}px`,
        top: `${event.clientY}px`
      },
      data: this.notifications
    };

    this.dialog.open(NotificationDialogComponent, dialogConfig).afterClosed().subscribe
      (result => {
        if(result) this.notifications = result;
      });
  }

  generateRandomColor(): string {
    const colors = ["red", "blue", "yellow", "green"];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }

  ngOnInit(): void {
    this.notificationListener.on('notification', (data: any) => {
      console.log(data);
      this.notifications.push(data);
    });

    this.notificationListener.emit('auth', {
      jwt: this.storage.getAuth().accessToken.jwt
    });
  }

  ngAfterViewInit(): void {
    this.cmp.nativeElement.classList.add("color-" + this.generateRandomColor());
  }

  randomColor = this.generateRandomColor();

  ngOnDestroy(): void {
    this.notificationListener.off('notification');
  }
}
