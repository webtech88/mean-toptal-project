import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { UserService, AuthenticationService } from '../../../services/index';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-user-reset-password',
  templateUrl: './user-reset-password.component.html',
  styleUrls: ['./user-reset-password.component.scss']
})
export class UserResetPasswordComponent implements OnInit, OnDestroy {
  model: any = {};
  userId: String;
  currentUser: User;
  loading = false;

  private _subscribe: any;

  constructor(
    private _route: ActivatedRoute,
    private _location: Location,
    private _router: Router,
    private _userService: UserService,
    private _authenticationService: AuthenticationService,
    private _toastr: ToastrService
  ) { }

  ngOnInit() {
    this._subscribe = this._route.params.subscribe(params => {
      this.userId = params['id'];     
      this.model._id = this.userId;
      this.currentUser = this._authenticationService.getUserData();
    });
  }

  ngOnDestroy() {
    this._subscribe.unsubscribe();
  }

  goPrevPage() {
    this._location.back();
  }

  save() {
    this.loading = true;
    this._userService.resetPassword(this.model)
      .subscribe(
        data => {
          this.loading = false;
          this._toastr.success('Password changed successfully.');
          this.goPrevPage();
        },
        error => {
          error = error.json();
          let message = error.message || 'Something went wrong, please try again.';
          this._toastr.error(message);
          this.loading = false;
        });
  }

}
