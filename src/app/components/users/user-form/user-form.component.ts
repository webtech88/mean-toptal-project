import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { UserService, AuthenticationService } from '../../../services/index';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit, OnDestroy {
  userId: String;
  user: any = {};
  loading: boolean = false;
  currentUser: User;
  types: string[] = ['user', 'manager', 'admin'];

  private _subscribe: any;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _authenticationService: AuthenticationService,
    private _toastr: ToastrService
  ) { }

  ngOnInit() {
    this._subscribe = this._route.params.subscribe(params => {
      this.userId = params['id'];
      this.currentUser = this._authenticationService.getUserData();
      if(this.userId) this.getUserById();
    });
  }

  ngOnDestroy() {
    this._subscribe.unsubscribe();
  }

  save() {
    this.loading = true;
    (this.userId ? this._userService.update(this.user) : this._userService.create(this.user))
      .subscribe(
        data => {
          this.loading = false;
          let message = this.userId ? 'User updated successfully.' : 'User created successfully.';
          this._toastr.success(message);
          this._router.navigate(['/users']);
        },
        error => {
          error = error.json();
          let message = error.message || 'Something went wrong, please try again.';
          this._toastr.error(message);
          this.loading = false;
        }
      );
  }

  private getUserById() {
    this._userService.getUserById(this.userId).subscribe(
      user => {
        this.user = user;
      },
      error => {
        error = error.json();
        let message = error.message || 'Something went wrong, please try again.';
        this._toastr.error(message);
        this._router.navigate(['/users']);
      }
    );
  }

}
