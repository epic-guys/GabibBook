import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { config } from 'rxjs';
import { AuthService } from 'src/app/common/services/auth/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

  token = null;

  constructor(
    private auth: AuthService,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      if (params['token']) {
        this.token = params['token'];
      }
    });
  }

  forgotPasswordForm = new FormGroup({
    email: new FormControl(
      '',
      Validators.compose([
        Validators.required,
        Validators.email
      ])
    )
  });

  newPassForm = new FormGroup({
    password: new FormControl(
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(8)
      ])
    ),
    confirmPassword: new FormControl(
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(8),
        (control: AbstractControl<any, any>) => {
          if (control.value !== this.newPassForm?.get('password')?.value) {
            return { passwordMismatch: true };
          }
          return null;
        }
      ])
    )
  });

  onNewPassSubmit(): void {
    if (this.newPassForm.valid) {
      const val = this.newPassForm.value.password;
      this.newPassForm.reset();

      const observer = {
        next: (response: any) => {
          this._snackBar.open('Password reset successfully',
            '',
            {
              duration: 3000,
            });
        },
        error: (error: any) => {
          console.error(error);
          this._snackBar.open('Error resetting password',
            '',
            {
              duration: 3000,
            });
        }
      };
      if(this.token){
        this.auth.confirmPasswordReset(this.token,{ password: String(val) }).subscribe(observer);
      }
      else{
        this._snackBar.open('Token not found',
            '',
            {
              duration: 3000,
            });
      }
    }
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      const val = this.forgotPasswordForm.value.email
      this.forgotPasswordForm.reset();

      const observer = {
        next: (response: any) => {
          this._snackBar.open('Password reset link sent to your email',
            '',
            {
              duration: 3000,
            });
        },
        error: (error: any) => {
          console.error(error);
          this._snackBar.open('Error sending password reset link',
            '',
            {
              duration: 3000,
            });
        }
      };
      this.auth.requestPasswordReset({ email: String(val) }).subscribe(observer);
    }
  }

}
