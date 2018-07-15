import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { UserService } from '../../services/index';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  model: any = {};
  loading = false;

  constructor(
    private _router: Router,
    private _userService: UserService,
    private _toastr: ToastrService
  ) { }

  register() {
    this.loading = true;
    this._userService.register(this.model)
      .subscribe(
        data => {
          this.loading = false;
          this._toastr.success('User registered successfully. Please check your email to verify your account.');
          this._router.navigate(['/login']);
        },
        error => {
          error = error.json();
          let message = error.message || 'Something went wrong, please try again.';
          this._toastr.error(message);
          this.loading = false;
        });
  }

}
