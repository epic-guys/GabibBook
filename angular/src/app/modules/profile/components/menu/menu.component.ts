import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../../common/services/storage/local-storage.service';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  isMod = false;
  constructor(private router: Router,  private localStorageService: LocalStorageService) {
    this.isMod = this.localStorageService.getRole() === 'moderator';
  }

  isActive(route: string) {
    return this.router.url === route;
  }

  logout() {
    this.localStorageService.removeAuth();
    this.router.navigate(['/']);
  }

  navigate(route: string) {
    this.router.navigate([route]);
  }

}
