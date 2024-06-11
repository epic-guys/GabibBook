import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../../common/services/storage/local-storage.service';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  //how can I have the current route in the menu component?
  //I need to know which route is active to highlight the corresponding menu item

  constructor(private router: Router,  private localStorageService: LocalStorageService) { }

  isActive(route: string) {
    // /profile should not be active when /profile/personal is active, hence the check for exact match
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
