import { StepperOrientation } from '@angular/cdk/stepper';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/common/services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
    accesscode: null | string = null;
    motd = 'To finalize your registration, click on the button below.'
    ajaxLoading = false;
    error = false;
    orientation: StepperOrientation = window.innerWidth < 768 ? 'vertical' : 'horizontal';
    
    constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) {
      this.accesscode = this.route.snapshot.queryParamMap.get('accesscode');
    }

    firstFormGroup = new FormGroup({
      nickname: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8),
        (control) => {
          if (control.value !== this.firstFormGroup?.get('password')?.value) {
            return { passwordMismatch: true };
          }
          return null;
        }
      ]),
    });

    secondFormGroup = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      phone: new FormControl('', [Validators.required, Validators.minLength(10)]),
    });

    thirdFormGroup = new FormGroup({
      address: new FormControl('', [Validators.required, Validators.minLength(5)]),
      city: new FormControl('', [Validators.required, Validators.minLength(2)]),
      nation: new FormControl('', [Validators.required, Validators.minLength(2)]),
    });


    register() {
      if (this.firstFormGroup.invalid || this.secondFormGroup.invalid || this.thirdFormGroup.invalid) {
        this.motd = 'Please fill in all the required fields.';
        return;
      }

      let data = {
        nickname: this.firstFormGroup.get('nickname')?.value,
        email: this.firstFormGroup.get('email')?.value,
        password: this.firstFormGroup.get('password')?.value,
        name: this.secondFormGroup.get('firstName')?.value,
        surname: this.secondFormGroup.get('lastName')?.value,
        phone: this.secondFormGroup.get('phone')?.value,
        address: this.thirdFormGroup.get('address')?.value,
        city: this.thirdFormGroup.get('city')?.value,
        nation: this.thirdFormGroup.get('nation')?.value
      };

      this.motd = 'Please wait...';
      this.ajaxLoading = true;

      const observer = {
        next: () => {
          this.motd = 'You have been successfully registered. You can now login.';
          this.firstFormGroup.reset();
          this.secondFormGroup.reset();
          this.thirdFormGroup.reset();
          this.ajaxLoading = false;
          this.router.navigate(['/login']);
        },
        error: (error: any) => {
          this.motd = error.message.message;
          this.error = true;
          this.ajaxLoading = false;
        }
      };

      if (this.accesscode) {
        data = { ...data, accesscode: this.accesscode } as typeof data & { accesscode: string };
      }

      this.authService.register(data).subscribe(observer);
    }
}
