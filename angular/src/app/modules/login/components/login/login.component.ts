import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService } from 'src/app/common/services/auth/auth.service';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/common/services/storage/local-storage.service';

import { Auth } from 'src/app/common/models/account/account';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  ajaxLoading: boolean = false;
  invalidCreds: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) { }

  loginForm = new FormGroup({
    email: new FormControl(
      '',
      Validators.compose([
        Validators.required,
        Validators.email
      ])
    ),
    password: new FormControl(
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ]
    )
  )
  });

  onSubmit() {
    if(this.loginForm.valid) {
      this.ajaxLoading = true;
      this.invalidCreds = false;


      const observer = {
        next: (res: any) => {
          this.ajaxLoading = false;
          const auth = new Auth(res)
          this.localStorageService.setAuth(auth)
          this.router.navigate(['/']);
        },
        error: (error: any) => {
          this.ajaxLoading = false;
          this.invalidCreds = true;

          console.error(error);
        },
        complete: () => {
          this.ajaxLoading = false;
        }
      }

      this.authService.login({
        "username": this.loginForm.value.email!,
        "password": this.loginForm.value.password!
      }
      ).subscribe(observer)
    }
  }

}
