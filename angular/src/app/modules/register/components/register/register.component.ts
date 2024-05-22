import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
    accesscode: null | string = null;
    
    constructor(private route: ActivatedRoute) { 
        this.accesscode = this.route.snapshot.queryParamMap.get('accesscode');
    }

    registerForm = new FormGroup({
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
          Validators.minLength(8)
        ])
      ),
      confirmPassword: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(8)
        ])
      ),
      firstName: new FormControl(
        '',
        Validators.compose([
          Validators.required
        ])
      ),
      lastName: new FormControl(
        '',
        Validators.compose([
          Validators.required
        ])
      ),
      address: new FormControl(
        '',
        Validators.compose([
          Validators.required
        ])
      ),
      city: new FormControl(
        '',
        Validators.compose([
          Validators.required
        ])
      ),
      state: new FormControl(
        '',
        Validators.compose([
          Validators.required
        ])
      ),
      zip: new FormControl(
        '',
        Validators.compose([
          Validators.required
        ])
      )
    });


    onSubmit() {
      if(this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
        console.log('Passwords do not match');
        return;
      }

      if(this.accesscode) {
        console.log('Form submitted with accesscode');
        //HERE WE REGISTER THE ADMIN
        return;
      }
      console.log('Form submitted');
    }
}
